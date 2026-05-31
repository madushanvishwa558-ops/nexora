// DOM Elements
const chatBox = document.getElementById('chatBox');
const input = document.getElementById('input');
let isLoading = false;

// Scroll to bottom
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Add message to UI
function addMessage(content, isUser) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${isUser ? 'user' : 'ai'}`;
  msgDiv.innerHTML = content.replace(/\n/g, '<br>');
  chatBox.appendChild(msgDiv);
  scrollToBottom();
}

// Typing indicator
function showTyping() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'msg ai';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = '<div class="typing"><span></span><span></span><span></span> Nexora is thinking...</div>';
  chatBox.appendChild(typingDiv);
  scrollToBottom();
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

// 🔥 CLEAN FORMATTER - Removes "OK:", "OK", and any weird prefixes
function cleanAIReply(rawReply) {
  if (!rawReply) return "No response from AI.";
  
  let cleaned = rawReply;
  
  // Remove "OK:" (with colon)
  cleaned = cleaned.replace(/^OK:\s*/i, '');
  
  // Remove "OK" (without colon) at beginning
  cleaned = cleaned.replace(/^OK\s+/i, '');
  
  // Remove any other weird prefixes like "OK: OK:"
  cleaned = cleaned.replace(/^(OK:\s*)+/i, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  // If empty after cleaning
  if (cleaned.length === 0) {
    return "🌐 No meaningful results. Try rephrasing.";
  }
  
  // Handle error messages
  if (cleaned.toLowerCase().includes("no results") || cleaned.toLowerCase().includes("api failed")) {
    return "📡 No relevant results. Try a broader query.";
  }
  if (cleaned.toLowerCase().includes("backend crash")) {
    return "⚠️ Backend issue. Please check Tavily API key.";
  }
  if (cleaned.toLowerCase().includes("no input")) {
    return "🤖 Please enter a question.";
  }
  
  // Add a small brain icon at the beginning (optional)
  return `<i class="fas fa-brain" style="margin-right: 6px; color: #ffd700;"></i> ${cleaned}`;
}

// API call to /api/chat
async function fetchAIResponse(userText) {
  const API_URL = '/api/chat';
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userText })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.reply || `HTTP ${response.status}`);
    }

    const data = await response.json();
    let rawReply = data.reply || "No reply from AI.";
    
    // 🔥 Apply cleaning
    const finalReply = cleanAIReply(rawReply);
    return finalReply;
    
  } catch (err) {
    console.error("API Error:", err);
    return `❌ Connection error: ${err.message}`;
  }
}

// Send message
async function send() {
  if (isLoading) return;
  const userText = input.value.trim();
  if (!userText) return;

  input.value = '';
  addMessage(userText, true);
  isLoading = true;
  showTyping();

  try {
    const aiResponse = await fetchAIResponse(userText);
    removeTyping();
    addMessage(aiResponse, false);
  } catch (err) {
    removeTyping();
    addMessage("⚠️ Something went wrong. Please try again.", false);
  } finally {
    isLoading = false;
    input.focus();
  }
}

// Clear chat
function clearChat() {
  const msgs = chatBox.querySelectorAll('.msg');
  for (let i = 0; i < msgs.length; i++) {
    if (i !== 0 || !msgs[i].classList.contains('ai')) {
      msgs[i].remove();
    }
  }
  addMessage("✨ Chat cleared. Ask me anything!", false);
}

// Enter to send
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    send();
  }
});

// Voice recognition
let recognition = null;
let isListening = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isListening = true;
    const micBtn = document.querySelector('.voice-btn');
    if (micBtn) {
      micBtn.classList.add('mic-listening');
      micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    }
  };

  recognition.onend = () => {
    isListening = false;
    const micBtn = document.querySelector('.voice-btn');
    if (micBtn) {
      micBtn.classList.remove('mic-listening');
      micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
  };

  recognition.onerror = () => {
    isListening = false;
    const micBtn = document.querySelector('.voice-btn');
    if (micBtn) {
      micBtn.classList.remove('mic-listening');
      micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    send();
  };
}

function startVoice() {
  if (!recognition) {
    alert("Voice recognition not supported in this browser.");
    return;
  }
  if (isListening) {
    recognition.stop();
    return;
  }
  try {
    recognition.start();
  } catch (err) {
    console.log("Voice error:", err);
  }
}

// Expose functions globally
window.send = send;
window.clearChat = clearChat;
window.startVoice = startVoice;
