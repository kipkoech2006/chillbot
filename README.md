# ChillBot Frontend (Vercel)

Mental health chatbot web interface deployed on Vercel.

## Local Setup
```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/chillbot-frontend.git
cd chillbot-frontend

# Start local server
python -m http.server 8000
# OR
npx serve .
```

Visit: http://localhost:8000

## Configuration

Update `js/config.js` with your Railway backend URL:
```javascript
return 'https://your-backend-name.up.railway.app/api';
```

## Deployment to Vercel

### Method 1: GitHub (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Deploy automatically

### Method 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Method 3: Drag & Drop

1. Zip your project folder
2. Go to https://vercel.com/new
3. Drag & drop the zip file

## Environment Variables (Optional)

No environment variables needed for static frontend.
Backend URL is configured in `js/config.js`.

## Features

- ✅ Real-time chat interface
- ✅ Emotion detection via ML backend
- ✅ Crisis detection & resources
- ✅ Mood tracking
- ✅ Responsive design
- ✅ Auto-reconnection

## Tech Stack

- HTML5
- CSS3 (Vanilla)
- JavaScript (ES6+)
- No framework dependencies!

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT