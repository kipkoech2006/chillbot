// Configuration for Vercel + Railway
const CONFIG = {
    // Auto-detect environment
    API_BASE_URL: (function() {
        const hostname = window.location.hostname;
        
        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:5000/api';
        }
        
        // Production - UPDATE THIS AFTER DEPLOYING BACKEND TO RAILWAY
        return 'https://dex-production-7cf7.up.railway.app';
    })(),
    
    USER_ID_PREFIX: 'user_',
    
    CRISIS_HOTLINES: {
        US: {
            suicide: '988',
            crisis_text: '741741',
            samhsa: '1-800-662-4357'
        },
        INTERNATIONAL: {
            website: 'https://findahelpline.com'
        }
    },
    
    // App settings
    APP_NAME: 'ChillBot',
    VERSION: '1.0.0'
};

console.log('🔧 Config loaded:', {
    environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    apiUrl: CONFIG.API_BASE_URL
});
