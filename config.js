const CONFIG = {
    API_BASE_URL: (function() {
        const hostname = window.location.hostname;
        
        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:5000/api';
        }
        
        // Production - PUT YOUR RAILWAY URL HERE!
        return 'https://dex-production-7cf7.up.railway.app/api';
        //      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        //      REPLACE THIS with YOUR actual Railway URL + /api
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
    
    APP_NAME: 'ChillBot',
    VERSION: '1.0.0'
};

console.log('🔧 Config loaded:', {
    environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    apiUrl: CONFIG.API_BASE_URL
});
```

**Important:** 
- Copy your Railway URL
- Add `/api` at the end
- Example: `https://your-app.up.railway.app/api`

---

## 🔧 Step 4: Update Backend CORS

Your backend needs to allow requests from your Vercel frontend:

### **In Railway Dashboard:**

1. Go to **Variables** tab
2. Click **"New Variable"**
3. Add:
```
   Variable name:  ALLOWED_ORIGINS
   Variable value: https://your-app.vercel.app
```
   **Replace `your-app.vercel.app` with your actual Vercel URL!**

4. Click **"Add"**
5. Railway will automatically redeploy

**Example:**
```
Variable: ALLOWED_ORIGINS
Value: https://chillbot-abc123.vercel.app
