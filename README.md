# Resumes.ai

Resumes.ai is a Chrome Extension for tailoring a truthful, ATS-friendly resume to a specific job description.
The workflow stays focused on the essentials:
1. Paste or extract a job description
2. Paste a Markdown resume
It does not auto-apply to jobs, fabricate achievements, or build a job-tracking dashboard.

## What It Does
- Extract a job description from the current page or paste one manually
- Upload or paste a Markdown resume
- Store the OpenRouter API key locally with `chrome.storage.local`
- Auto-run analysis once both the JD and resume are present
- Show a practical tailoring summary:
-  ATS Match Score
-  Role Type
-  Strong Areas
-  Missing Keywords
-  Add Now
-  Remove or Deprioritize
-  Update First
-  Experience Positioning
-  Resume Focus
- Generate a Gemini prompt that rewrites the resume only with truthful, supported content
- Keep saved settings and candidate notes tucked away so the popup stays clean

## Candidate Context
The popup includes an optional **Candidate Context** section for notes such as:

- internship-only profile
- early-career / 1–3 years equivalent profile
- target role
- salary expectations
- job research notes
- what to emphasize or avoid

These notes are used only for truthful framing. They are not inserted into the resume.
## Tech Stack

- Chrome Extension Manifest V3
- React
- TailwindCSS
- OpenRouter API
- `chrome.storage.local`

## Run Locally
```bash
npm install
npm run build
```

The production extension is written to `dist/`.
To load it in Chrome:
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` folder

## Usage
1. Open the extension popup
2. Save your OpenRouter API key in **API Settings**
3. Paste or upload your Markdown resume
4. Paste a JD or click **Extract JD From Current Page**
5. Add optional **Candidate Context** if you want truthful early-career framing
6. Review the analysis results
7. Copy the generated Gemini prompt and paste it into Gemini manually

## Behavior
- The extension compares the JD and the resume with AI
- It falls back to a local estimate if AI is unavailable
- The prompt intentionally avoids invented experience, certifications, projects, and full-time ownership claims
- If a JD keyword is not supported by the resume, the rewrite stays selective instead of forcing it in

## Author
Deepak Parkash

- LinkedIn: https://www.linkedin.com/in/deepakparkash/

## Notes
- API keys are stored locally in `chrome.storage.local`
- Resume and JD text are also stored locally for convenience
- Saved API settings can be reopened later to edit or remove the key
- The generated prompt is meant to improve existing content, not fabricate new claims
