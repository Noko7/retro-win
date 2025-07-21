// ===== LIVE CHAT ROOM APPLICATION =====

class LiveChatRoom {
    constructor() {
        this.username = null;
        this.userId = this.generateUserId();
        this.messages = [];
        this.lastMessageTime = 0;
        this.messageLimit = 100; // Maximum messages to keep in memory
        this.rateLimitDelay = 1000; // 1 second between messages
        this.lastSentTime = 0;
        this.pollInterval = 2000; // Check for new messages every 2 seconds
        this.isInitialized = false;
        this.chatWindow = null;
        this.onlineUsers = new Set();
        this.heartbeatInterval = 10000; // Send heartbeat every 10 seconds
        
        this.initChat();
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    initChat() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupChat());
        } else {
            this.setupChat();
        }
    }

    setupChat() {
        this.chatWindow = document.querySelector('.popup-window:has([title="Live Chat Room"])') || 
                         document.querySelector('[data-chat-window]');
        
        if (!this.chatWindow) {
            console.error('Chat window not found');
            return;
        }

        // Enhanced chat window setup
        this.enhanceChatWindow();
        
        // Load existing messages
        this.loadMessages();
        
        // Setup nickname
        this.setupNickname();
        
        // Start polling for new messages
        this.startPolling();
        
        // Setup heartbeat to show online status
        this.startHeartbeat();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
        
        this.isInitialized = true;
        console.log('LiveChatRoom initialized with userId:', this.userId);
    }

    enhanceChatWindow() {
        const chatContent = this.chatWindow.querySelector('.window-content');
        if (!chatContent) return;

        chatContent.innerHTML = `
            <div class="chat-header">
                <div class="chat-status">
                    <span id="online-count" class="online-indicator">● 1 user online</span>
                    <button class="chat-settings-btn" onclick="window.liveChat.showSettings()">⚙️</button>
                </div>
                <div class="chat-controls">
                    <button class="clear-chat-btn" onclick="window.liveChat.clearChat()">Clear</button>
                    <button class="toggle-sound-btn" onclick="window.liveChat.toggleSound()">🔊</button>
                </div>
            </div>
            
            <div id="chatMessages" class="chat-messages">
                <div class="system-message">Welcome to RetroWin Chat! 👋</div>
                <div class="system-message">Set your nickname to start chatting...</div>
            </div>
            
            <div class="chat-input-area">
                <input id="chatInput" type="text" placeholder="Type a message..." maxlength="500" />
                <button id="sendButton" onclick="window.liveChat.sendMessage()">Send</button>
            </div>
            
            <div class="chat-status-bar">
                <span id="chat-status">Ready</span>
                <span id="message-counter">0/100 messages</span>
            </div>
        `;

        // Add event listeners
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Show typing indicator
            chatInput.addEventListener('input', () => {
                this.updateTypingStatus();
            });
        }
    }

    setupNickname() {
        // Check if nickname is stored
        this.username = localStorage.getItem('retrochat_nickname');
        
        if (!this.username) {
            this.promptForNickname();
        } else {
            this.updateChatStatus(`Welcome back, ${this.username}!`);
        }
    }

    promptForNickname() {
        const nickname = prompt('Enter your nickname for the chat room:');
        if (nickname && nickname.trim()) {
            this.username = this.sanitizeInput(nickname.trim()).substring(0, 20);
            localStorage.setItem('retrochat_nickname', this.username);
            this.updateChatStatus(`Welcome, ${this.username}!`);
            this.sendSystemMessage(`${this.username} joined the chat`);
        } else {
            this.username = 'Anonymous' + Math.floor(Math.random() * 1000);
            this.updateChatStatus(`Welcome, ${this.username}!`);
        }
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;

        const message = input.value.trim();
        if (!message) return;

        // Rate limiting check
        const now = Date.now();
        if (now - this.lastSentTime < this.rateLimitDelay) {
            this.updateChatStatus('Please wait before sending another message...');
            return;
        }

        // Validate message
        if (!this.validateMessage(message)) {
            this.updateChatStatus('Message contains invalid content');
            return;
        }

        const messageObj = {
            id: this.generateMessageId(),
            username: this.username || 'Anonymous',
            userId: this.userId,
            message: this.sanitizeInput(message),
            timestamp: now,
            type: 'user'
        };

        // Add to local messages
        this.addMessage(messageObj);
        
        // Save to localStorage for other users
        this.saveMessage(messageObj);
        
        // Clear input and update status
        input.value = '';
        this.lastSentTime = now;
        this.updateChatStatus('Message sent');
        
        // Play sound
        this.playNotificationSound('send');
    }

    validateMessage(message) {
        // Basic content filtering
        const forbiddenWords = ['script', '<', '>', 'javascript:', 'onclick', 'onerror'];
        const lowerMessage = message.toLowerCase();
        
        return !forbiddenWords.some(word => lowerMessage.includes(word));
    }

    sanitizeInput(input) {
        // Remove HTML tags and dangerous characters
        return input.replace(/[<>\"'&]/g, (match) => {
            const htmlEntities = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return htmlEntities[match];
        });
    }

    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    addMessage(messageObj, isNew = true) {
        const messagesDiv = document.getElementById('chatMessages');
        if (!messagesDiv) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${messageObj.type}-message`;
        messageElement.dataset.messageId = messageObj.id;

        const timestamp = new Date(messageObj.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (messageObj.type === 'system') {
            messageElement.innerHTML = `
                <span class="system-text">${messageObj.message}</span>
                <span class="message-time">${timestamp}</span>
            `;
        } else {
            const isOwnMessage = messageObj.userId === this.userId;
            messageElement.classList.add(isOwnMessage ? 'own-message' : 'other-message');
            
            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="username ${isOwnMessage ? 'own-username' : ''}">${messageObj.username}</span>
                    <span class="message-time">${timestamp}</span>
                </div>
                <div class="message-text">${messageObj.message}</div>
            `;
        }

        messagesDiv.appendChild(messageElement);
        
        // Keep only the last 100 messages
        const messages = messagesDiv.querySelectorAll('.chat-message');
        if (messages.length > this.messageLimit) {
            messages[0].remove();
        }

        // Auto-scroll to bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Play notification sound for new messages from others
        if (isNew && messageObj.userId !== this.userId && messageObj.type === 'user') {
            this.playNotificationSound('receive');
        }

        // Update message counter
        this.updateMessageCounter();
    }

    saveMessage(messageObj) {
        try {
            // Get existing messages
            const existingMessages = JSON.parse(localStorage.getItem('retrochat_messages') || '[]');
            
            // Add new message
            existingMessages.push(messageObj);
            
            // Keep only recent messages (last 100)
            if (existingMessages.length > this.messageLimit) {
                existingMessages.splice(0, existingMessages.length - this.messageLimit);
            }
            
            // Save back to localStorage
            localStorage.setItem('retrochat_messages', JSON.stringify(existingMessages));
            localStorage.setItem('retrochat_last_update', Date.now().toString());
        } catch (e) {
            console.error('Error saving message:', e);
        }
    }

    sendSystemMessage(message) {
        const messageObj = {
            id: this.generateMessageId(),
            username: 'System',
            userId: 'system',
            message: message,
            timestamp: Date.now(),
            type: 'system'
        };

        this.saveMessage(messageObj);
    }

    loadMessages() {
        try {
            const savedMessages = JSON.parse(localStorage.getItem('retrochat_messages') || '[]');
            
            // Load recent messages (last 50)
            const recentMessages = savedMessages.slice(-50);
            
            recentMessages.forEach(messageObj => {
                this.addMessage(messageObj, false);
            });

            this.lastMessageTime = savedMessages.length > 0 ? 
                Math.max(...savedMessages.map(m => m.timestamp)) : 0;

        } catch (e) {
            console.error('Error loading messages:', e);
        }
    }

    startPolling() {
        setInterval(() => {
            this.checkForNewMessages();
            this.updateOnlineUsers();
        }, this.pollInterval);
    }

    checkForNewMessages() {
        try {
            const lastUpdate = parseInt(localStorage.getItem('retrochat_last_update') || '0');
            if (lastUpdate <= this.lastMessageTime) return;

            const savedMessages = JSON.parse(localStorage.getItem('retrochat_messages') || '[]');
            const newMessages = savedMessages.filter(msg => 
                msg.timestamp > this.lastMessageTime && msg.userId !== this.userId
            );

            newMessages.forEach(messageObj => {
                this.addMessage(messageObj, true);
            });

            if (newMessages.length > 0) {
                this.lastMessageTime = Math.max(...newMessages.map(m => m.timestamp));
            }
        } catch (e) {
            console.error('Error checking for new messages:', e);
        }
    }

    startHeartbeat() {
        // Update online status
        this.updateUserHeartbeat();
        
        setInterval(() => {
            this.updateUserHeartbeat();
        }, this.heartbeatInterval);
    }

    updateUserHeartbeat() {
        try {
            const onlineUsers = JSON.parse(localStorage.getItem('retrochat_online') || '{}');
            onlineUsers[this.userId] = {
                username: this.username,
                lastSeen: Date.now()
            };
            
            // Remove users who haven't been seen for more than 30 seconds
            const thirtySecondsAgo = Date.now() - 30000;
            Object.keys(onlineUsers).forEach(userId => {
                if (onlineUsers[userId].lastSeen < thirtySecondsAgo) {
                    delete onlineUsers[userId];
                }
            });
            
            localStorage.setItem('retrochat_online', JSON.stringify(onlineUsers));
        } catch (e) {
            console.error('Error updating heartbeat:', e);
        }
    }

    updateOnlineUsers() {
        try {
            const onlineUsers = JSON.parse(localStorage.getItem('retrochat_online') || '{}');
            const userCount = Object.keys(onlineUsers).length;
            
            const onlineCountElement = document.getElementById('online-count');
            if (onlineCountElement) {
                onlineCountElement.textContent = `● ${userCount} user${userCount !== 1 ? 's' : ''} online`;
            }
        } catch (e) {
            console.error('Error updating online users:', e);
        }
    }

    updateChatStatus(message) {
        const statusElement = document.getElementById('chat-status');
        if (statusElement) {
            statusElement.textContent = message;
            setTimeout(() => {
                statusElement.textContent = 'Ready';
            }, 3000);
        }
    }

    updateMessageCounter() {
        const messagesDiv = document.getElementById('chatMessages');
        const counterElement = document.getElementById('message-counter');
        
        if (messagesDiv && counterElement) {
            const messageCount = messagesDiv.querySelectorAll('.chat-message').length;
            counterElement.textContent = `${messageCount}/${this.messageLimit} messages`;
        }
    }

    updateTypingStatus() {
        // Simple typing indicator (could be enhanced)
        this.updateChatStatus('Typing...');
    }

    clearChat() {
        if (confirm('Are you sure you want to clear all chat messages?')) {
            localStorage.removeItem('retrochat_messages');
            localStorage.removeItem('retrochat_last_update');
            
            const messagesDiv = document.getElementById('chatMessages');
            if (messagesDiv) {
                messagesDiv.innerHTML = `
                    <div class="system-message">Chat cleared</div>
                `;
            }
            
            this.updateChatStatus('Chat cleared');
            this.updateMessageCounter();
        }
    }

    showSettings() {
        const currentNickname = this.username;
        const newNickname = prompt('Enter new nickname:', currentNickname);
        
        if (newNickname && newNickname.trim() && newNickname !== currentNickname) {
            const oldUsername = this.username;
            this.username = this.sanitizeInput(newNickname.trim()).substring(0, 20);
            localStorage.setItem('retrochat_nickname', this.username);
            
            this.sendSystemMessage(`${oldUsername} changed nickname to ${this.username}`);
            this.updateChatStatus(`Nickname changed to ${this.username}`);
        }
    }

    toggleSound() {
        const soundEnabled = localStorage.getItem('retrochat_sound') !== 'false';
        localStorage.setItem('retrochat_sound', (!soundEnabled).toString());
        
        const soundButton = document.querySelector('.toggle-sound-btn');
        if (soundButton) {
            soundButton.textContent = soundEnabled ? '🔇' : '🔊';
        }
        
        this.updateChatStatus(`Sound ${soundEnabled ? 'disabled' : 'enabled'}`);
    }

    playNotificationSound(type) {
        if (localStorage.getItem('retrochat_sound') === 'false') return;

        try {
            // Create simple notification sounds using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'send') {
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            } else if (type === 'receive') {
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Fallback: no sound if Web Audio API fails
        }
    }

    cleanup() {
        // Remove user from online list
        try {
            const onlineUsers = JSON.parse(localStorage.getItem('retrochat_online') || '{}');
            delete onlineUsers[this.userId];
            localStorage.setItem('retrochat_online', JSON.stringify(onlineUsers));
            
            this.sendSystemMessage(`${this.username} left the chat`);
        } catch (e) {
            console.error('Error during cleanup:', e);
        }
    }
}

// Global functions for backward compatibility
function sendMessage() {
    if (window.liveChat) {
        window.liveChat.sendMessage();
    }
}

// Initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.liveChat = new LiveChatRoom();
});

// Fallback initialization
if (document.readyState !== 'loading') {
    window.liveChat = new LiveChatRoom();
}
  