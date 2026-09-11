# Jessica Danielle C. Ande — Professional Portfolio

A modern single-page IT portfolio based on the supplied CV, with a Projects section and a pre-designed chatbot that can switch to Groq AI when `GROQ_API_KEY` is configured.

## Included projects

- PCU Student Enrollment Form — web form interface; preview is privacy-redacted.
- Loops & Iterations — interactive JavaScript exercise using user input and conditional logic.
- Multiplication Table — 1–5 multiplication table exercise.
- My Birth Month Calendar — November 2025 themed calendar UI.

## 1. Run locally

Install Node.js 18+.

```bash
npm install
npm start
```

Open:

http://localhost:3000

The chatbot works in **Demo mode** even without a Groq key.

## 2. Turn on Groq AI

1. Create a Groq API key.
2. Copy `.env.example` to `.env`.
3. Put your key in `GROQ_API_KEY`.
4. Restart the server.

The browser never receives the API key. The key stays on the Node/Express server.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Add professional portfolio and projects"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## 4. Deploy on Render

Create a new **Web Service**, connect the GitHub repository, then use:

- Build Command: `npm install`
- Start Command: `npm start`

Add environment variables in Render:

- `GROQ_API_KEY` = your Groq API key
- `GROQ_MODEL` = `llama-3.3-70b-versatile`

## 5. Chatbot architecture

Visitor browser → `/api/chat` on your Render service → Groq API → response → browser.

This keeps the Groq API key off the public frontend.
