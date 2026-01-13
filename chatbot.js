// Flowise API Configuration
const FLOWISE_API_URL = 'https://flowise-production-5871.up.railway.app/api/v1/prediction/c17792d2-94ac-4f3e-960e-ea1ed823d278';

// Initialize conversation timestamp
let conversationStartTime = new Date();

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Toggle icon visibility
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if (isDarkMode) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        darkModeToggle.setAttribute('data-tooltip', 'Light Mode');
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        darkModeToggle.setAttribute('data-tooltip', 'Dark Mode');
    }
}

// Load dark mode preference
function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
        if (darkModeToggle) {
            darkModeToggle.setAttribute('data-tooltip', 'Light Mode');
        }
    } else {
        if (darkModeToggle) {
            darkModeToggle.setAttribute('data-tooltip', 'Dark Mode');
        }
    }
}

// Format date and time
function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleString('en-US', options);
}

// Update timestamp display
function updateTimestamp() {
    const timestampElement = document.getElementById('chatTimestamp');
    if (timestampElement) {
        timestampElement.textContent = `Started: ${formatDateTime(conversationStartTime)}`;
    }
}

// Clear conversation
function clearConversation() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <div class="message-content">
                Hi! I'm your soup cooking assistant. Ask me about Chinese soup recipes, cooking techniques, or ingredient substitutions!
            </div>
        </div>
    `;
    conversationStartTime = new Date();
    updateTimestamp();
}

// Markdown renderer for bot responses
function renderMarkdown(text) {
    if (!text) return '';
    
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

// Send message to Flowise API
async function query(userMessage) {
    try {
        const response = await fetch(FLOWISE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: userMessage
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.text || data.answer || 'Sorry, I could not process that request.';
    } catch (error) {
        console.error('Error querying chatbot:', error);
        return 'Sorry, I encountered an error. Please try again later.';
    }
}

// Add message to chat UI
function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = isUser ? content : renderMarkdown(content);
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="message-content"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Handle sending message
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    userInput.disabled = true;
    sendButton.disabled = true;
    
    addMessage(message, true);
    userInput.value = '';
    
    showTypingIndicator();
    
    const response = await query(message);
    
    hideTypingIndicator();
    addMessage(response, false);
    
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const refreshButton = document.getElementById('refreshButton');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Initialize timestamp and dark mode
    updateTimestamp();
    loadDarkModePreference();
    
    sendButton.addEventListener('click', sendMessage);
    
    refreshButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the conversation?')) {
            clearConversation();
        }
    });
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
