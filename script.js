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

// 🎓 SUBJECT DETECTION FUNCTION
function detectSubject(question) {
  const q = question.toLowerCase();
  
  const subjects = {
    maths: ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'trigonometry', 'equation', 'solve', 'sum', 'plus', 'minus', 'multiply', 'divide', 'fraction', 'decimal', 'percentage', 'ratio', 'pythagoras', 'theorem', 'derivative', 'integral'],
    science: ['science', 'physics', 'chemistry', 'biology', 'atom', 'molecule', 'cell', 'gravity', 'force', 'energy', 'light', 'sound', 'electricity', 'magnet', 'reaction', 'acid', 'base', 'compound', 'element', 'periodic table', 'photosynthesis', 'respiration', 'dna', 'rna'],
    music: ['music', 'song', 'notes', 'melody', 'rhythm', 'chord', 'scale', 'instrument', 'piano', 'guitar', 'violin', 'drum', 'singer', 'composer', 'beethoven', 'mozart', 'bach', 'melody', 'harmony', 'tempo'],
    english: ['english', 'grammar', 'vocabulary', 'essay', 'poem', 'poetry', 'literature', 'shakespeare', 'novel', 'story', 'writing', 'reading', 'comprehension', 'tense', 'verb', 'noun', 'adjective', 'adverb'],
    history: ['history', 'ancient', 'modern', 'world war', 'civilization', 'empire', 'king', 'queen', 'president', 'revolution', 'independence', 'colonial', 'medieval', 'renaissance'],
    geography: ['geography', 'country', 'capital', 'river', 'mountain', 'ocean', 'continent', 'climate', 'weather', 'population', 'map', 'location', 'border', 'landmark'],
    sinhala: ['sinhala', 'sinhalese', 'සිංහල', 'සාහිත්‍යය', 'ව්‍යාකරණ', 'පද්‍ය', 'ගද්‍ය'],
    ict: ['ict', 'computer', 'programming', 'coding', 'python', 'java', 'javascript', 'html', 'css', 'database', 'network', 'internet', 'software', 'hardware', 'algorithm', 'ai', 'artificial intelligence']
  };
  
  for (const [subject, keywords] of Object.entries(subjects)) {
    for (const keyword of keywords) {
      if (q.includes(keyword)) {
        return subject;
      }
    }
  }
  return null; // General question
}

// 🎓 SUBJECT-SPECIFIC SYSTEM PROMPTS
function getSubjectPrompt(subject, question) {
  const prompts = {
    maths: `You are a friendly Math tutor for school students. Explain step by step. Use simple language. Show formulas when needed. Examples are helpful. Question: ${question}`,
    
    science: `You are a Science teacher. Explain clearly with examples. For physics/chemistry/biology, give real-world examples. Question: ${question}`,
    
    music: `You are a Music teacher. Explain music theory, instruments, composers, songs, or notes in an easy way. Question: ${question}`,
    
    english: `You are an English teacher. Help with grammar, vocabulary, writing, or literature. Give examples. Question: ${question}`,
    
    history: `You are a History teacher. Explain historical events, dates, and important figures clearly. Question: ${question}`,
    
    geography: `You are a Geography teacher. Explain countries, capitals, physical features, climate, and cultures. Question: ${question}`,
    
    sinhala: `You are a Sinhala language teacher. Help with Sinhala grammar, literature (sahithya), poetry (padya), prose (gadya). පැහැදිලි සරල සිංහලෙන් පිළිතුරු දෙන්න. Question: ${question}`,
    
    ict: `You are an ICT/Computer Science teacher. Explain programming, computers, software, hardware, or internet concepts simply. Question: ${question}`
  };
  
  return prompts[subject] || `You are a helpful school teacher. Answer clearly for students. Question: ${question}`;
}

// 🔥 CLEAN FORMATTER - Removes "OK:" prefix
function cleanAIReply(rawReply) {
  if (!rawReply) return "No response from AI.";
  
  let cleaned = rawReply;
  cleaned = cleaned.replace(/^OK:\s*/i, '');
  cleaned = cleaned.replace(/^OK\s+/i, '');
  cleaned = cleaned.replace(/^(OK:\s*)+/i, '');
  cleaned = cleaned.trim();
  
  if (cleaned.length === 0) {
    return "🌐 No meaningful results. Try rephrasing.";
  }
  
  // Check for web search fallback
  if (cleaned.toLowerCase().includes("no results") || cleaned.toLowerCase().includes("api failed")) {
    return teachFromKnowledge(cleaned);
  }
  
  return cleaned;
}

// 📚 FALLBACK: Built-in knowledge for common questions
function teachFromKnowledge(query) {
  const q = query.toLowerCase();
  
  // Math answers
  if (q.includes('pythagoras') || (q.includes('right') && q.includes('triangle'))) {
    return `📐 <strong>Pythagoras Theorem:</strong><br>In a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides.<br><br>Formula: <strong>a² + b² = c²</strong><br><br>Example: If a=3, b=4, then c = √(9+16) = √25 = 5`;
  }
  
  if (q.includes('area') && q.includes('circle')) {
    return `⚪ <strong>Area of a Circle:</strong><br>Formula: <strong>A = πr²</strong><br><br>Where r = radius, π ≈ 3.14159<br><br>Example: If radius = 5cm, Area = 3.14 × 25 = 78.5 cm²`;
  }
  
  if (q.includes('quadratic')) {
    return `📈 <strong>Quadratic Equation:</strong><br>General form: <strong>ax² + bx + c = 0</strong><br><br>Solution formula: <strong>x = [-b ± √(b² - 4ac)] / 2a</strong><br><br>Example: x² - 5x + 6 = 0 → x = 2 or x = 3`;
  }
  
  // Science answers
  if (q.includes('photosynthesis')) {
    return `🌱 <strong>Photosynthesis:</strong><br>Plants make food using sunlight, water, and carbon dioxide.<br><br>Equation: <strong>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</strong><br><br>Sunlight + Chlorophyll + Water + CO₂ → Glucose + Oxygen`;
  }
  
  if (q.includes('newton') && q.includes('law')) {
    return `🍎 <strong>Newton's Laws of Motion:</strong><br><br>
    1️⃣ <strong>First Law (Inertia):</strong> An object stays at rest or moves at constant velocity unless acted by a force.<br>
    2️⃣ <strong>Second Law (F=ma):</strong> Force = mass × acceleration<br>
    3️⃣ <strong>Third Law:</strong> Every action has an equal and opposite reaction.`;
  }
  
  if (q.includes('cell') && (q.includes('biology') || q.includes('structure'))) {
    return `🔬 <strong>Cell (Biology):</strong><br>The basic structural and functional unit of all living organisms.<br><br>
    • <strong>Nucleus:</strong> Control center<br>
    • <strong>Mitochondria:</strong> Powerhouse<br>
    • <strong>Cell membrane:</strong> Outer boundary<br>
    • <strong>Cytoplasm:</strong> Jelly-like substance`;
  }
  
  // Music answers
  if (q.includes('notes') || (q.includes('music') && q.includes('scale'))) {
    return `🎵 <strong>Music Notes (Western):</strong><br><br>
    <strong>Natural notes:</strong> C, D, E, F, G, A, B<br>
    <strong>Sharps (#):</strong> Raise by half step<br>
    <strong>Flats (b):</strong> Lower by half step<br><br>
    <strong>Major Scale pattern:</strong> Whole, Whole, Half, Whole, Whole, Whole, Half`;
  }
  
  if (q.includes('beethoven')) {
    return `🎹 <strong>Ludwig van Beethoven (1770-1827):</strong><br>German composer and pianist. One of the most admired composers in Western music. Famous works: Symphony No. 5, Für Elise, Moonlight Sonata, Symphony No. 9 (Ode to Joy).`;
  }
  
  // General fallback
  return `📚 <strong>I couldn't find web results, but here's what I know:</strong><br><br>Please try asking more specifically. Example questions:<br>
  • "Explain Pythagoras theorem"<br>
  • "What is photosynthesis?"<br>
  • "Tell me about Beethoven"<br>
  • "Solve quadratic equation"<br>
  • "What are Newton's laws?"`;
}

// 🌐 API call to /api/chat with subject awareness
async function fetchAIResponse(userText) {
  const API_URL = '/api/chat';
  
  // Detect subject
  const subject = detectSubject(userText);
  let enhancedQuery = userText;
  
  if (subject) {
    enhancedQuery = getSubjectPrompt(subject, userText);
    console.log(`📚 Subject detected: ${subject}`);
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: enhancedQuery })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.reply || `HTTP ${response.status}`);
    }

    const data = await response.json();
    let rawReply = data.reply || "No reply from AI.";
    
    let finalReply = cleanAIReply(rawReply);
    
    // If web search failed or returned nothing, use built-in knowledge
    if (finalReply.includes("No relevant results") || finalReply.includes("no meaningful") || rawReply.includes("No results")) {
      finalReply = teachFromKnowledge(userText);
    }
    
    // Add subject badge if detected
    if (subject) {
      const subjectEmojis = {
        maths: '📐',
        science: '🔬',
        music: '🎵',
        english: '📖',
        history: '🏛️',
        geography: '🌍',
        sinhala: '📜',
        ict: '💻'
      };
      const emoji = subjectEmojis[subject] || '🎓';
      finalReply = `${emoji} <strong>[${subject.toUpperCase()} TUTOR]</strong><br><br>${finalReply}`;
    }
    
    return finalReply;
    
  } catch (err) {
    console.error("API Error:", err);
    return teachFromKnowledge(userText);
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
  addMessage(`✨ <strong>Nexora AI - School Tutor Mode</strong><br><br>
  I can help with:<br>
  📐 Maths (Algebra, Geometry, Calculus)<br>
  🔬 Science (Physics, Chemistry, Biology)<br>
  🎵 Music (Theory, Composers, Notes)<br>
  📖 English (Grammar, Literature)<br>
  🏛️ History (World, Ancient, Modern)<br>
  🌍 Geography (Countries, Capitals, Climate)<br>
  📜 Sinhala (සිංහල සාහිත්‍යය)<br>
  💻 ICT (Programming, Computers)<br><br>
  Ask me anything!`, false);
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
