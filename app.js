const toggle = document.getElementById("chatToggle");
const panel = document.getElementById("chatPanel");
const close = document.getElementById("chatClose");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const messages = document.getElementById("messages");
const modeLabel = document.getElementById("chatMode");

let history = [];

toggle.addEventListener("click", () => {
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  input.focus();
});
close.addEventListener("click", () => {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
});

document.querySelectorAll(".quick-actions button").forEach(btn => {
  btn.addEventListener("click", () => sendMessage(btn.dataset.prompt));
});

form.addEventListener("submit", e => {
  e.preventDefault();
  sendMessage(input.value);
});

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

async function sendMessage(text) {
  text = String(text || "").trim();
  if (!text) return;

  input.value = "";
  addMessage(text, "user");

  const loading = addMessage("Thinking…", "bot");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history })
    });

    const data = await res.json();
    loading.remove();

    if (!res.ok) throw new Error(data.error || "Request failed");

    addMessage(data.reply, "bot");
    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: data.reply });
    history = history.slice(-8);

    modeLabel.textContent = data.mode === "groq" ? "Groq AI mode" : "Demo mode";
  } catch (err) {
    loading.textContent = "Sorry, something went wrong. Please try again.";
  }
}
