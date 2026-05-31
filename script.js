// DOM Elements
const chatBox = document.getElementById('chatBox');
const input = document.getElementById('input');
let isLoading = false;

// Auto-scroll function
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Add message to chat
function addMessage(content, isUser) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${isUser ? 'user' : 'ai'}`;
  msgDiv.innerHTML = content.replace(/\n/g, '<br>');
  chatBox.appendChild(msgDiv);
  scrollToBottom();
  return msgDiv;
}

// Show typing indicator
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

// API call to backend (/api/chat)
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
    let reply = data.reply || "No reply from AI.";
    
    // Format the response
    if (reply.startsWith("OK:")) {
      let trimmed = reply.substring(3).trim();
      if (trimmed.length > 0) {
        reply = `<i class="fas fa-globe"></i> <strong>🔍 Web Insights (Tavily):</strong><br><br>${trimmed}<br><br><span style="font-size:0.7rem; opacity:0.7;">✨ real-time search</span>`;
      } else {
        reply = "🌐 No results found. Try rephrasing.";
      }
    } else if (reply.includes("No results") || reply.includes("API failed")) {
      reply = "📡 No relevant results. Try a broader query.";
    } else if (reply.includes("Backend crash")) {
      reply = "⚠️ Backend issue. Check Tavily API key.";
    } else if (reply === "No input") {
      reply = "🤖 Please enter a question.";
    }
    return reply;
  } catch (err) {
    console.error("API Error:", err);
    return `❌ Error: ${err.message}. Make sure backend is running at /api/chat`;
  }
}

// Send message function
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

// Clear chat history
function clearChat() {
  const msgs = chatBox.querySelectorAll('.msg');
  for (let i = 0; i < msgs.length; i++) {
    if (i !== 0 || !msgs[i].classList.contains('ai')) {
      msgs[i].remove();
    }
  }
  addMessage("✨ Chat cleared. Video background continues.", false);
}

// Enter key support
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    send();
  }
});

// ========== VOICE RECOGNITION ==========
let recognition = null;
const micBtn = document.getElementById('micBtn');
const listeningLabel = document.getElementById('listeningLabel');
const voiceFeedback = document.getElementById('voiceFeedback');
const voiceCard = document.getElementById('voiceCard');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    voiceCard.classList.add('listening-active');
    listeningLabel.innerHTML = '<i class="fas fa-microphone"></i> Listening... speak now';
    voiceFeedback.innerHTML = '🎙️ Voice active — speak your question';
    if (micBtn) micBtn.style.borderColor = '#ffd700';
  };
  
  recognition.onend = () => {
    voiceCard.classList.remove('listening-active');
    listeningLabel.innerHTML = '<i class="fas fa-circle"></i> Go ahead, I\'m listening...';
    if (micBtn) micBtn.style.borderColor = 'rgba(255, 215, 0, 0.4)';
    if (voiceFeedback.innerHTML.includes('active')) {
      setTimeout(() => {
        voiceFeedback.innerHTML = '🎤 Tap the mic & speak naturally';
      }, 1500);
    }
  };
  
  recognition.onerror = (event) => {
    console.warn('Speech error:', event.error);
    voiceCard.classList.remove('listening-active');
    listeningLabel.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Mic error';
    voiceFeedback.innerHTML = '⚠️ Could not recognize. Check microphone permissions.';
    setTimeout(() => {
      listeningLabel.innerHTML = '<i class="fas fa-circle"></i> Go ahead, I\'m listening...';
      voiceFeedback.innerHTML = '🎤 Tap the mic & speak naturally';
    }, 2000);
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    voiceFeedback.innerHTML = `✨ Recognized: "${transcript.substring(0, 50)}" — searching...`;
    listeningLabel.innerHTML = '<i class="fas fa-check-circle"></i> Voice captured!';
    
    // Send the voice transcript to chat
    input.value = transcript;
    send();
    
    setTimeout(() => {
      if (!voiceCard.classList.contains('listening-active')) {
        listeningLabel.innerHTML = '<i class="fas fa-circle"></i> Go ahead, I\'m listening...';
        voiceFeedback.innerHTML = '🎤 Tap the mic & speak naturally';
      }
    }, 3000);
  };
}

function startVoice() {
  if (!recognition) {
    if (voiceFeedback) voiceFeedback.innerHTML = '❌ Voice not supported in this browser';
    return;
  }
  try {
    recognition.start();
  } catch (err) {
    console.log('Voice already started');
  }
}

// Make functions global for onclick
window.send = send;
window.clearChat = clearChat;
window.startVoice = startVoice;
