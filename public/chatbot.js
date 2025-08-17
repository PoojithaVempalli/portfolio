// chatbot.js
// Chatbot widget logic for Poojitha Vempalli Portfolio

(() => {
  const chatbotWidget = document.getElementById('chatbot-widget');
  const chatbotToggle = document.getElementById('chatbotToggle');
  const closeChatbotBtn = document.getElementById('closeChatbot');
  const sendMessageBtn = document.getElementById('sendMessage');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');

  // Conversation history (session-based)
  const conversationHistory = [];

  // Utility function to create a message element
  function createMessageElement(role, content) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', role === 'user' ? 'user-message' : 'bot-message');

    const avatarEl = document.createElement('div');
    avatarEl.classList.add('message-avatar');
    avatarEl.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const contentEl = document.createElement('div');
    contentEl.classList.add('message-content');
    contentEl.innerHTML = `<p>${content}</p>`;

    messageEl.appendChild(avatarEl);
    messageEl.appendChild(contentEl);
    return messageEl;
  }

  // Append message to chat window and scroll to bottom
  function appendMessage(role, content) {
    const messageEl = createMessageElement(role, content);
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Initial greeting
  appendMessage('bot', "Hi! I'm Poojitha's Portfolio Assistant. Ask me anything about her background, skills, experience, or projects! 🚀");

  // Toggle chatbot visibility
  function toggleChatbot() {
    if (chatbotWidget.style.display === 'flex') {
      chatbotWidget.style.display = 'none';
    } else {
      chatbotWidget.style.display = 'flex';
      chatInput.focus();
    }
  }

  // Event listeners
  chatbotToggle.addEventListener('click', toggleChatbot);
  closeChatbotBtn.addEventListener('click', () => {
    chatbotWidget.style.display = 'none';
  });

  sendMessageBtn.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  });

  function setLoading(state) {
    typingIndicator.style.display = state ? 'flex' : 'none';
  }

  async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Append user message
    appendMessage('user', message);
    conversationHistory.push({ role: 'user', content: message });
    chatInput.value = '';
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory })
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      const botReply = data.response;

      appendMessage('bot', botReply);
      conversationHistory.push({ role: 'assistant', content: botReply });
    } catch (err) {
      console.error(err);
      appendMessage('bot', '⚠️ Sorry, something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }
})();