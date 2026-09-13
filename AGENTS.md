# Samin's Faceless Shorts Creator

Use Codex to create researched vertical videos. Default image provider: built-in Codex image generation using ChatGPT subscription authentication, never an OpenAI API key fallback. Default audio and generated motion provider: authenticated Higgsfield CLI. Remotion assembles the final video.

Read `brand.md` and the selected project's brief before producing assets. Run tools from the repository root. Use `python3 tools/generate_media.py --help` for Higgsfield assets; use the built-in image tool for images and copy the exact returned file into `media/projects/<project>/`. Where the built-in tool is unavailable, `tools/codex_image.sh` uses the Codex CLI subscription flow.

Preserve upstream license and historical authorship. Samin is the maintainer of this adaptation. Do not add assistant coauthor trailers.

For health content, verify primary sources and save a claim-to-source record. Distinguish evidence for individual ingredients from evidence for a combination. Label illustrative before/after visuals throughout; do not invent patient results or imply endorsement. Include relevant contraindications and realistic timelines.

Generate only requested media. Reuse cached assets unless regeneration is requested. Preserve generated media and provenance. Never commit secrets, account status dumps or signed download links. If authentication or credit limits block generation, report the actual blocker; never silently switch billing providers.

After adding a composition run `cd remotion && npm run gen`. Render and inspect representative frames, check audio and timing, then render the final. Do not call rough timing word-exact captions. Existing legacy examples and tools remain available but are not the defaults.

For AI UGC, lock one fictional adult identity using a generated reference image. Disclose the synthetic presenter and simulated comparisons. Prefer exact on-screen ingredient names with plain spoken explanations when generated speech mispronounces technical names. Inspect mouths, hands, baked captions, and the actual transcript before export. Preserve real experts’ original words; third-party excerpt drafts without established reuse permission stay local in `private-review/` and must not be committed or published.
