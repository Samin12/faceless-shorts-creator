#!/usr/bin/env python3
"""Build a LOCAL, visibly watermarked review draft using the selected Doctorly excerpt.

This script does not establish usage rights and must not publish its output.
"""
import argparse
from pathlib import Path
import subprocess
import tempfile
from PIL import Image, ImageDraw, ImageFont


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--ugc', type=Path, required=True)
    p.add_argument('--excerpt', type=Path, required=True)
    p.add_argument('--out', type=Path, required=True)
    p.add_argument('--font', type=Path, default=Path('/System/Library/Fonts/Supplemental/Arial.ttf'))
    a = p.parse_args()
    for file in (a.ugc, a.excerpt, a.font):
        if not file.is_file():
            p.error(f'Missing file: {file}')
    if a.out.exists():
        p.error('Output exists; choose a new path')
    a.out.parent.mkdir(parents=True, exist_ok=True)
    # Render standalone title graphics; works with FFmpeg builds without drawtext.
    temp = tempfile.TemporaryDirectory()
    doctor_overlay = Path(temp.name) / 'doctor.png'
    watermark = Path(temp.name) / 'watermark.png'
    doctor = Image.new('RGBA', (1080, 1920))
    draw = ImageDraw.Draw(doctor)
    draw.rectangle((0, 0, 1080, 310), fill='#213E36')
    draw.rectangle((0, 1530, 1080, 1920), fill='#213E36')
    def label(canvas, text, size, y):
        d = ImageDraw.Draw(canvas)
        font = ImageFont.truetype(str(a.font), size)
        box = d.textbbox((0, 0), text, font=font)
        d.text(((1080-(box[2]-box[0]))/2, y), text, font=font, fill='white')
    label(doctor, 'INDEPENDENT INGREDIENT COMMENTARY', 36, 140)
    label(doctor, 'On azelaic acid + tretinoin', 40, 205)
    label(doctor, 'Source - Doctorly / YouTube', 35, 1590)
    label(doctor, 'Not an endorsement of Samin or this product', 33, 1650)
    label(doctor, 'Original audio / unchanged meaning', 29, 1710)
    doctor.save(doctor_overlay)
    mark = Image.new('RGBA', (1080, 1920))
    ImageDraw.Draw(mark).rectangle((0, 0, 1080, 67), fill=(0,0,0,230))
    label(mark, 'PRIVATE REVIEW - USAGE PERMISSION PENDING', 29, 17)
    mark.save(watermark)
    filters = (
        '[0:v]fps=30,split=2[v0][v1];'
        '[0:a]asplit=2[a0][a1];'
        '[v0]trim=end=5.5,setpts=PTS-STARTPTS[vfirst];'
        '[v1]trim=start=5.5,setpts=PTS-STARTPTS[vlast];'
        '[a0]atrim=end=5.5,asetpts=PTS-STARTPTS[afirst];'
        '[a1]atrim=start=5.5,asetpts=PTS-STARTPTS[alast];'
        '[1:v]trim=duration=5,setpts=PTS-STARTPTS,fps=30,'
        'scale=1080:1200:force_original_aspect_ratio=decrease,'
        'pad=1080:1920:(ow-iw)/2:310:color=0x213E36,setsar=1[doctorbg];'
        '[doctorbg][2:v]overlay=0:0[vdoctor];'
        '[1:a]atrim=duration=5,asetpts=PTS-STARTPTS,afade=t=out:st=4.96:d=0.04[adoctor];'
        '[vfirst][afirst][vdoctor][adoctor][vlast][alast]concat=n=3:v=1:a=1[v][a];'
        '[v][3:v]overlay=0:0[out]'
    )
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(a.ugc), '-i', str(a.excerpt),
                    '-i', str(doctor_overlay), '-i', str(watermark),
                    '-filter_complex', filters, '-map', '[out]', '-map', '[a]',
                    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(a.out)], check=True)
    subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', str(a.out)], check=True)
    print(a.out)
    temp.cleanup()


if __name__ == '__main__':
    main()
