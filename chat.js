// ====================================
// LIVE CHAT WIDGET
// Real-time customer support interface
// ====================================

class LiveChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.setupChatWidget();
        this.loadChatHistory();
    }

    setupChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.id = 'chatWidget';
        chatWidget.innerHTML = `
      <button class="chat-toggle" id="chatToggle">
        <span class="chat-icon">💬</span>
        <span class="chat-badge" id="chatBadge">1</span>
      </button>
      
      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <div class="chat-header-info">
            <h3>Live Support</h3>
            <span class="chat-status">
              <span class="status-dot"></span>
              Online
            </span>
          </div>
          <button class="chat-minimize" id="chatMinimize">−</button>
        </div>
        
        <div class="chat-messages" id="chatMessages">
          <div class="chat-message bot">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-text">
                Hi! 👋 I'm here to help with your shipping needs. How can I assist you today?
              </div>
              <div class="message-time">${this.getTime()}</div>
            </div>
          </div>
        </div>
        
        <div class="chat-quick-replies" id="chatQuickReplies">
          <button class="quick-reply" data-message="I need help tracking my shipment">📦 Track Shipment</button>
          <button class="quick-reply" data-message="I want to get a quote">💰 Get Quote</button>
          <button class="quick-reply" data-message="I have a question about services">❓ Services Info</button>
        </div>
        
        <div class="chat-input-container">
          <input 
            type="text" 
            id="chatInput" 
            class="chat-input" 
            placeholder="Type your message..."
            autocomplete="off"
          >
          <button class="chat-send" id="chatSend">
            <span>➤</span>
          </button>
        </div>
      </div>
    `;
        document.body.appendChild(chatWidget);

        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        const toggle = document.getElementById('chatToggle');
        const minimize = document.getElementById('chatMinimize');
        const send = document.getElementById('chatSend');
        const input = document.getElementById('chatInput');
        const quickReplies = document.querySelectorAll('.quick-reply');

        if (toggle) {
            toggle.addEventListener('click', () => this.toggleChat());
        }

        if (minimize) {
            minimize.addEventListener('click', () => this.toggleChat());
        }

        if (send) {
            send.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.sendMessage(message);
                document.getElementById('chatQuickReplies').style.display = 'none';
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatWindow');
        const chatBadge = document.getElementById('chatBadge');

        if (chatWindow) {
            chatWindow.classList.toggle('active');
        }

        if (this.isOpen && chatBadge) {
            chatBadge.style.display = 'none';
        }
    }

    sendMessage(text = null) {
        const input = document.getElementById('chatInput');
        const message = text || input?.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');

        if (input) input.value = '';

        // Simulate typing indicator
        this.showTypingIndicator();

        // Simulate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        const avatar = sender === 'bot' ? '🤖' : '👤';

        messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        <div class="message-text">${text}</div>
        <div class="message-time">${this.getTime()}</div>
      </div>
    `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({ text, sender, time: new Date() });
        this.saveChatHistory();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'chat-message bot';
        typingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Tracking-related
        if (lowerMessage.includes('track') || lowerMessage.includes('shipment')) {
            return 'I can help you track your shipment! Please enter your tracking number in the tracking section above, or provide it here and I\'ll look it up for you. 📦';
        }

        // Quote-related
        if (lowerMessage.includes('quote') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return 'I\'d be happy to help you get a quote! You can use our instant quote calculator above, or tell me your shipping details (origin, destination, weight) and I\'ll calculate it for you. 💰';
        }

        // Services
        if (lowerMessage.includes('service') || lowerMessage.includes('freight') || lowerMessage.includes('shipping')) {
            return 'We offer Ground Freight, Air Freight, Ocean Freight, and Warehousing services. Each service has different delivery times and pricing. Would you like details about a specific service? 🚛✈️🚢';
        }

        // Hours/Support
        if (lowerMessage.includes('hour') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
            return 'Our customer support is available 24/7! You can reach us at (555) 123-4567 or support@emeraldcityfreight.com. How else can I assist you? 📞';
        }

        // Delivery time
        if (lowerMessage.includes('delivery') || lowerMessage.includes('how long') || lowerMessage.includes('eta')) {
            return 'Delivery times vary by service: Ground (3-5 days), Air (1-2 days), Ocean (2-4 weeks), Expedited (24 hours). Want a specific quote for your shipment? ⏱️';
        }

        // Payment
        if (lowerMessage.includes('pay') || lowerMessage.includes('payment') || lowerMessage.includes('credit card')) {
            return 'We accept all major credit cards, PayPal, and wire transfers. You can pay securely when booking your shipment. Need help with a payment? 💳';
        }

        // Insurance
        if (lowerMessage.includes('insurance') || lowerMessage.includes('protect')) {
            return 'All shipments include comprehensive cargo insurance at no extra cost! We cover the full declared value of your shipment. 🔒';
        }

        // Default responses
        const defaultResponses = [
            'That\'s a great question! Let me connect you with a specialist who can provide detailed information. In the meantime, feel free to explore our services above. 😊',
            'I\'m here to help! Could you provide more details about what you need? You can also check out our FAQ section or contact our support team directly. 💬',
            'Thanks for reaching out! For specific inquiries, our team is available 24/7 at (555) 123-4567. Is there anything else I can help you with? 🙌'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    showWelcomeMessage() {
        // Show badge after 3 seconds to attract attention
        setTimeout(() => {
            const badge = document.getElementById('chatBadge');
            if (badge && !this.isOpen) {
                badge.style.display = 'flex';
            }
        }, 3000);
    }

    getTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    saveChatHistory() {
        localStorage.setItem('ecf_chat_history', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('ecf_chat_history');
        if (saved) {
            try {
                this.messages = JSON.parse(saved);
            } catch (e) {
                this.messages = [];
            }
        }
    }
}

// Initialize live chat
const liveChat = new LiveChat();
