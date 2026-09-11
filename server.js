const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const profile = {
  name: "Jessica Danielle C. Ande",
  title: "IT Support Intern / On-the-Job Trainee",
  objective:
    "A motivated and hardworking student seeking opportunities to apply her skills, gain practical experience, and contribute to organizational goals while continuing to develop professionally.",
  skills: [
    "Problem Solving",
    "Eagerness to Learn",
    "Prioritization",
    "Adaptability and openness to new ideas"
  ],
  technical: {
    "MS Word": "Document formatting, mail merge, templates, tracking changes/reviewing",
    "MS Excel": "Data entry, VLOOKUP/XLOOKUP, pivot tables, charts/graphs, formulas and functions",
    "MS PowerPoint": "Presentation design, animations and transitions, master slides, infographic design"
  },
  experience: [
    {
      role: "IT Support Intern / On-the-Job Trainee",
      dates: "August 19, 2026 – Present",
      bullets: [
        "Provide technical support and troubleshooting assistance for computer hardware, software, and other IT-related concerns.",
        "Assist with checking, setting up, and maintaining computer equipment and workstations.",
        "Manage the borrowing, retrieval, and proper return of IT equipment and devices.",
        "Assist with pickup, delivery, and transfer of computer equipment and IT resources.",
        "Support daily IT operations by responding to basic technical concerns and ensuring equipment is functioning properly.",
        "Gain practical experience in IT troubleshooting, technical support, equipment management, and workplace IT operations."
      ]
    }
  ],
  education: [
    {
      level: "Tertiary",
      school: "Philippine Christian University",
      location: "1648 Taft Avenue, Malate, Manila",
      dates: "2023 – Present"
    },
    {
      level: "Secondary",
      school: "Concordia College",
      location: "1739 Pedro Gil St., Paco, Manila",
      dates: "2021 – 2023"
    }
  ],
  seminars: [
    ["Blockchain Summit", "November 2025"],
    ["Building the Future: Real-World Tools for IT and CS Students", "May 2025"],
    ["Private Education Assistance Committee (PEAC)", ""],
    ["Data Privacy Act 2012 Awareness", "2021"]
  ],
  achievements: ["College Dean’s Lister (2025–2026)"],
  projects: [
    {
      name: "PCU Student Enrollment Form",
      category: "Web Form",
      technologies: ["HTML", "CSS", "JavaScript"],
      description: "A student enrollment form interface with structured personal, contact, and course information fields, plus a submission-success state."
    },
    {
      name: "Loops & Iterations",
      category: "Programming",
      technologies: ["HTML", "JavaScript"],
      description: "An interactive exercise that accepts a number from the user and demonstrates conditional logic around the entered value."
    },
    {
      name: "Multiplication Table",
      category: "Programming",
      technologies: ["HTML", "JavaScript"],
      description: "A multiplication table from 1 through 5 demonstrating structured table generation and basic arithmetic logic."
    },
    {
      name: "My Birth Month Calendar",
      category: "Web Design",
      technologies: ["HTML", "CSS"],
      description: "A themed November 2025 calendar interface combining a calendar grid with a visual background and highlighted date."
    }
  ]
};

const systemPrompt = `You are the portfolio assistant for ${profile.name}.
Answer questions using only the portfolio information supplied below.
Be professional, concise, friendly, and helpful.
Do not invent employers, certifications, technologies, dates, projects, or contact information.
If information is not in the portfolio, say that it is not listed and suggest contacting Jessica directly.
Portfolio:
${JSON.stringify(profile, null, 2)}
Contact email: jdaniellecamacho7@gmail.com
Phone: 09950931497`;

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!message) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    // The site works without an API key using the pre-designed demo responses.
    if (!process.env.GROQ_API_KEY) {
      return res.json({
        mode: "demo",
        reply: getDemoReply(message)
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const safeHistory = history
      .filter(m => m && (m.role === "user" || m.role === "assistant"))
      .slice(-8)
      .map(m => ({
        role: m.role,
        content: String(m.content).slice(0, 2000)
      }));

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        ...safeHistory,
        { role: "user", content: message }
      ]
    });

    res.json({
      mode: "groq",
      reply: completion.choices?.[0]?.message?.content || "I couldn't generate a response right now."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "The chatbot is temporarily unavailable. Please try again."
    });
  }
});

function getDemoReply(message) {
  const q = message.toLowerCase();

  if (q.includes("skill") || q.includes("technical")) {
    return "Jessica's skills include problem solving, eagerness to learn, prioritization, adaptability, and Microsoft Office skills. Her technical experience includes MS Word, Excel, and PowerPoint.";
  }
  if (q.includes("project") || q.includes("portfolio work") || q.includes("built")) {
    return "Jessica's listed projects include a PCU Student Enrollment Form, Loops & Iterations, a Multiplication Table, and a Birth Month Calendar. They demonstrate web forms, JavaScript logic, table generation, and calendar UI design.";
  }
  if (q.includes("experience") || q.includes("intern") || q.includes("work")) {
    return "Jessica is an IT Support Intern / On-the-Job Trainee. Her work includes technical support, troubleshooting, workstation setup and maintenance, IT equipment management, and day-to-day IT operations.";
  }
  if (q.includes("education") || q.includes("school") || q.includes("university")) {
    return "Jessica is currently studying at Philippine Christian University in Manila. She previously attended Concordia College.";
  }
  if (q.includes("seminar") || q.includes("training")) {
    return "Her listed seminars include Blockchain Summit (November 2025), Building the Future: Real-World Tools for IT and CS Students (May 2025), PEAC, and Data Privacy Act 2012 Awareness (2021).";
  }
  if (q.includes("achievement") || q.includes("dean")) {
    return "Jessica's listed achievement is being on the College Dean's List for 2025–2026.";
  }
  if (q.includes("contact") || q.includes("email") || q.includes("phone")) {
    return "You can contact Jessica at jdaniellecamacho7@gmail.com or 09950931497.";
  }

  return "Hi! I'm Jessica's portfolio assistant. Ask me about her skills, IT internship experience, projects, education, seminars, achievements, or contact information.";
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio running on http://localhost:${PORT}`);
});
