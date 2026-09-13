#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 2 ]]; then
  echo 'Usage: bash tools/codex_image.sh PROMPT_FILE OUTPUT_IMAGE' >&2
  exit 2
fi
prompt_file="$1"
output_path="$(python3 -c 'import pathlib,sys; print(pathlib.Path(sys.argv[1]).resolve())' "$2")"
[[ -s "$prompt_file" ]] || { echo 'Prompt file missing or empty' >&2; exit 2; }
[[ ! -e "$output_path" ]] || { echo 'Output exists; choose a new filename' >&2; exit 2; }
mkdir -p "$(dirname "$output_path")"
prompt_text="$(cat "$prompt_file")"
# Uses the installed CLI and existing ChatGPT login; no Platform API billing.
# Do not guess a newly created image from another session if the exact output is missing.
env -u OPENAI_API_KEY codex exec --enable image_generation --sandbox workspace-write \
  "Generate one image using the built-in image tool. Prompt: $prompt_text
Copy the exact generated image to $output_path. Do not use an API key or external image API. Return the saved path."
[[ -s "$output_path" ]] || { echo 'Requested image was not saved; inspect Codex output' >&2; exit 1; }
