// API Communication Layer for ChillBot
class ChillBotAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.timeout = 10000; // 10 seconds
    }

    // Helper: Fetch with timeout
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    // Health check
    async checkHealth() {
        try {
            const response = await this.fetchWithTimeout(`${this.baseURL}/health`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return null;
        }
    }

    // Analyze message
    async analyzeMessage(message, userId) {
        try {
            const response = await this.fetchWithTimeout(`${this.baseURL}/analyze`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    message: message,
                    user_id: userId 
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Message analysis failed:', error);
            throw error;
        }
    }

    // Log mood
    async logMood(userId, moodScore, emotion) {
        try {
            const response = await this.fetchWithTimeout(`${this.baseURL}/mood/log`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    mood_score: moodScore,
                    emotion: emotion
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Mood logging failed:', error);
            return null;
        }
    }

    // Get mood trend
    async getMoodTrend(userId, days = 7) {
        try {
            const response = await this.fetchWithTimeout(
                `${this.baseURL}/mood/trend?user_id=${userId}&days=${days}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Mood trend fetch failed:', error);
            return null;
        }
    }

    // Get resources
    async getResources() {
        try {
            const response = await this.fetchWithTimeout(`${this.baseURL}/resources`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Resources fetch failed:', error);
            return null;
        }
    }
}

// Initialize API
const api = new ChillBotAPI(CONFIG.API_BASE_URL);

console.log('🔌 API initialized:', CONFIG.API_BASE_URL);