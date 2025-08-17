# I'll create the additional CSS for the chatbot widget to be appended to the existing style.css
chatbot_css = """

/* ================================ */
/* CHATBOT WIDGET STYLES */
/* ================================ */

/* Chatbot Toggle Button */
.chatbot-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  transition: all var(--duration-normal) var(--ease-standard);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chatbot-toggle:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4);
}

.chatbot-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

/* Chatbot Widget */
.chatbot-widget {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 380px;
  height: 500px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  display: none;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: slideInUp 0.3s var(--ease-standard);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Chatbot Header */
.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-16) var(--space-20);
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.chatbot-title {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.chatbot-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.chatbot-title h4 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.chatbot-status {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.chatbot-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.chatbot-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Chatbot Messages */
.chatbot-messages {
  flex: 1;
  padding: var(--space-16);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  background: var(--portfolio-surface);
}

.chatbot-messages::-webkit-scrollbar {
  width: 6px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: var(--accent-purple);
}

/* Message Styles */
.message {
  display: flex;
  gap: var(--space-12);
  max-width: 85%;
}

.bot-message {
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.bot-message .message-avatar {
  background: var(--gradient-primary);
  color: white;
}

.user-message .message-avatar {
  background: var(--accent-blue);
  color: white;
}

.message-content {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-12) var(--space-16);
  position: relative;
}

.user-message .message-content {
  background: var(--accent-blue);
  color: white;
  border-color: var(--accent-blue);
}

.message-content p {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

/* Message Animation */
.message {
  animation: messageSlideIn 0.3s var(--ease-standard);
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Chatbot Input */
.chatbot-input {
  padding: var(--space-16) var(--space-20) var(--space-20);
  background: var(--portfolio-surface);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  border-top: 1px solid var(--glass-border);
}

.input-container {
  display: flex;
  gap: var(--space-8);
  align-items: center;
}

#chatInput {
  flex: 1;
  padding: var(--space-12) var(--space-16);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  color: var(--portfolio-text);
  font-size: var(--font-size-sm);
  outline: none;
  transition: all var(--duration-fast) var(--ease-standard);
}

#chatInput:focus {
  border-color: var(--accent-purple);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.send-button {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-standard);
}

.send-button:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  margin-top: var(--space-8);
  color: var(--portfolio-text-secondary);
  font-size: var(--font-size-xs);
}

.typing-dots {
  display: flex;
  gap: var(--space-4);
}

.typing-dot {
  width: 6px;
  height: 6px;
  background: var(--accent-purple);
  border-radius: 50%;
  animation: typingDot 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }
.typing-dot:nth-child(3) { animation-delay: 0s; }

@keyframes typingDot {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Error State */
.message-error {
  color: var(--color-error);
  font-style: italic;
}

.message-error::before {
  content: "⚠️ ";
}

/* Mobile Responsiveness for Chatbot */
@media (max-width: 768px) {
  .chatbot-widget {
    bottom: 90px;
    right: 16px;
    left: 16px;
    width: auto;
    height: 450px;
  }
  
  .chatbot-toggle {
    bottom: 20px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .chatbot-widget {
    bottom: 90px;
    right: 8px;
    left: 8px;
    height: 400px;
  }
}

/* Quick Suggestions (Optional Enhancement) */
.quick-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  margin-top: var(--space-12);
}

.quick-suggestion {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  padding: var(--space-6) var(--space-12);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--portfolio-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}

.quick-suggestion:hover {
  background: var(--accent-purple);
  color: white;
  border-color: var(--accent-purple);
}

/* Chatbot Loading Animation */
.chatbot-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-20);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--accent-purple);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Accessibility Improvements */
.chatbot-widget:focus-within {
  outline: 2px solid var(--accent-purple);
  outline-offset: 2px;
}

.message[role="status"] {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}

/* Dark Mode Specific Adjustments */
[data-theme="dark"] .chatbot-widget {
  background: rgba(31, 33, 33, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .chatbot-messages {
  background: var(--color-charcoal-800);
}

[data-theme="dark"] .message-content {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] #chatInput {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--color-gray-200);
}

[data-theme="dark"] #chatInput::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* End of Chatbot Styles */
"""

print("Chatbot CSS styles prepared successfully!")
print(f"Total CSS length: {len(chatbot_css)} characters")
print("Key features included:")
print("- Responsive chatbot widget")
print("- Modern glassmorphism design")
print("- Typing indicators and animations")  
print("- Dark mode support")
print("- Mobile-friendly responsive design")
print("- Accessibility improvements")
print("- Message animations and transitions")