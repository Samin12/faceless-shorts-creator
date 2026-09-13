#!/usr/bin/env python3
"""Generate cached Higgsfield audio/video with explicit provenance (stdlib only)."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import urllib.request


def command(kind, prompt, reference=None):
    model = 'seed_audio' if kind == 'audio' else 'seedance_2_0'
    args = ['higgsfield', 'generate', 'create', model, '--prompt', prompt]
    if kind == 'video':
        args += ['--duration', '5', '--aspect_ratio', '9:16', '--resolution', '1080p']
        if reference:
            args += ['--start-image', str(reference)]
    return args + ['--wait', '--json']


def result_url(value):
    """Only inspect output fields; never mistake an input/reference URL for a result."""
    if isinstance(value, list):
        for item in value:
            found = result_url(item)
            if found:
                return found
    if isinstance(value, dict):
        if value.get('status') in ('failed', 'cancelled', 'canceled'):
            return None
        for key in ('results', 'result', 'outputs', 'output', 'media', 'jobs'):
            if key in value:
                found = result_url(value[key])
                if found:
                    return found
        for key in ('result_url', 'url', 'download_url', 'audio_url', 'video_url'):
            url = value.get(key)
            if isinstance(url, str) and url.startswith('https://'):
                return url
    if isinstance(value, str) and value.startswith('https://'):
        return value
    return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('kind', choices=['audio', 'video'])
    parser.add_argument('--prompt-file', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--reference', type=Path)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    prompt = args.prompt_file.read_text().strip()
    if not prompt:
        parser.error('Prompt must not be empty')
    if args.reference and (args.kind != 'video' or not args.reference.is_file()):
        parser.error('Reference must be an existing image for a video job')
    cmd = command(args.kind, prompt, args.reference)
    if args.dry_run:
        print(json.dumps(cmd))
        return
    if args.out.exists():
        parser.error('Output exists; choose a new filename to regenerate intentionally')
    subprocess.run(['higgsfield', 'account', 'status'], check=True, stdout=subprocess.DEVNULL)
    response = subprocess.run(cmd, check=True, capture_output=True, text=True)
    data = json.loads(response.stdout)
    url = result_url(data)
    if not url:
        raise RuntimeError('No output URL returned; inspect job with Higgsfield CLI. No automatic retry/spend.')
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=args.out.parent, suffix=args.out.suffix) as temp:
        with urllib.request.urlopen(url, timeout=120) as source:
            while block := source.read(1024 * 1024):
                temp.write(block)
        temp.flush()
        probe = subprocess.run(['ffprobe', '-v', 'error', '-show_entries',
                                'stream=codec_type', '-of', 'json', temp.name],
                               check=True, capture_output=True, text=True)
        if args.kind not in {s['codec_type'] for s in json.loads(probe.stdout)['streams']}:
            raise RuntimeError('Generation returned the wrong media type')
        content = Path(temp.name).read_bytes()
    if not content:
        raise RuntimeError('Empty generation result')
    args.out.write_bytes(content)
    args.out.with_suffix(args.out.suffix + '.json').write_text(json.dumps({
        'provider': 'higgsfield', 'model': cmd[3], 'prompt': prompt,
        'sha256': hashlib.sha256(content).hexdigest(),
        'reference': str(args.reference) if args.reference else None,
    }, indent=2) + '\n')
    print(args.out)


if __name__ == '__main__':
    main()
