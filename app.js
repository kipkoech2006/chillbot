// Main Application Logic for ChillBot
console.log('🚀 ChillBot starting...');

// Generate unique user ID
const USER_ID = CONFIG.USER_ID_PREFIX + Math.random().toString(36).substr(2, 9);

// State
let currentMood = null;
let isBackendConnected = false;
let messageHistory = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM loaded, initializing...');
    document.getElementById('initialTime').textContent = getCurrentTime();
    checkBackendConnection();
    setupEventListeners();
});

// Get current time
function getCurrentTime() {
    return new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Setup event listeners
function setupEventListeners() {
    // Enter key to send
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

// Check backend connection
async function checkBackendConnection() {
    console.log('🔍 Checking backend connection...');
    
    try {
        const response = await api.checkHealth();
        
        if (response && response.status === 'healthy') {
            isBackendConnected = true;
            document.getElementById('statusText').textContent = 'Online';
            document.getElementById('connectionError').classList.remove('show');
            console.log('✅ Backend connected:', response);
        } else {
            throw new Error('Backend not responding properly');
        }
    } catch (error) {
        isBackendConnected = false;
        document.getElementById('statusText').textContent = 'Offline';
        document.getElementById('connectionError').classList.add('show');
        console.error('❌ Backend connection failed:', error);
    }
}

// Select mood
function selectMood(score, label) {
    currentMood = score;
    
    // Update UI
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.mood-btn').classList.add('selected');
    
    // Set input
    const messageInput = document.getElementById('messageInput');
    messageInput.value = `I'm feeling ${label.toLowerCase()} today`;
    messageInput.focus();
    
    // Log mood to backend
    if (isBackendConnected) {
        api.logMood(USER_ID, score, null)
            .then(() => console.log('📊 Mood logged:', score, label))
            .catch(err => console.error('Failed to log mood:', err));
    }
    
    console.log('😊 Mood selected:', score, label);
}

// Add message to chat
function addMessage(text, type) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${escapeHtml(text)}</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    chatArea.appendChild(messageDiv);
    
    // Auto-scroll
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
    
    // Store in history
    messageHistory.push({
        text: text,
        type: type,
        timestamp: new Date().toISOString()
    });
    
    console.log(`💬 Message added (${type}):`, text.substring(0, 50) + '...');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show/hide typing indicator
function showTyping(show) {
    const indicator = document.getElementById('typingIndicator');
    const chatArea = document.getElementById('chatArea');
    
    if (show) {
        indicator.classList.add('show');
        console.log('⏳ Typing indicator shown');
    } else {
        indicator.classList.remove('show');
        console.log('✓ Typing indicator hidden');
    }
    
    // Auto-scroll
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
}

// Close crisis alert
function closeAlert() {
    document.getElementById('crisisAlert').classList.remove('show');
    console.log('❌ Crisis alert closed');
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) {
        console.log('⚠️ Empty message, ignoring');
        return;
    }
    
    console.log('📤 Sending message:', message);
    
    // Disable input while processing
    input.disabled = true;
    document.getElementById('sendBtn').disabled = true;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';
    
    // Show typing indicator
    showTyping(true);
    
    // Check if backend is offline
    if (!isBackendConnected) {
        console.log('⚠️ Backend offline, showing fallback message');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showTyping(false);
        addMessage(
            "I'm currently offline. Please make sure the backend server is running. " +
            "If you're in crisis, please call 988 (Suicide & Crisis Lifeline) immediately.",
            'bot'
        );
        
        // Re-enable input
        input.disabled = false;
        document.getElementById('sendBtn').disabled = false;
        input.focus();
        return;
    }
    
    try {
        // Call ML backend
        console.log('🔮 Analyzing message with ML backend...');
        const data = await api.analyzeMessage(message, USER_ID);
        
        console.log('📊 Analysis result:', data);
        
        // Show crisis alert if needed
        if (data.is_crisis) {
            document.getElementById('crisisAlert').classList.add('show');
            console.log('🚨 CRISIS DETECTED:', data.crisis_keyword);
        }
        
        // Log mood if emotion detected and mood was selected
        if (data.emotion && currentMood) {
            console.log('📊 Logging mood with emotion:', data.emotion);
            api.logMood(USER_ID, currentMood, data.emotion)
                .catch(err => console.error('Failed to log mood:', err));
        }
        
        // Simulate natural typing delay
        const delay = Math.min(Math.max(data.response.message.length * 20, 1000), 3000);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        showTyping(false);
        addMessage(data.response.message, 'bot');
        
        console.log('✅ Response delivered');
        
    } catch (error) {
        console.error('❌ Error analyzing message:', error);
        
        showTyping(false);
        addMessage(
            "I'm having trouble connecting right now. Please try again in a moment. " +
            "If you need immediate support, please contact 988 (Suicide & Crisis Lifeline).",
            'bot'
        );
    } finally {
        // Re-enable input
        input.disabled = false;
        document.getElementById('sendBtn').disabled = false;
        input.focus();
    }
}

// Periodically check backend connection
setInterval(checkBackendConnection, 30000); // Every 30 seconds

// Log app info
console.log('✨ ChillBot initialized', {
    userId: USER_ID,
    apiUrl: CONFIG.API_BASE_URL,
    version: CONFIG.VERSION
});