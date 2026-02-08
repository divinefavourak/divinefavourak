# Portfolio Backend - Email Service

Custom Node.js/Express backend for handling contact form submissions.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your details:
```bash
cp .env.example .env
```

### 3. Gmail Setup (Important!)
To use Gmail, you need an **App Password** (not your regular Gmail password):

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll to **App passwords** (at the bottom)
4. Select **Mail** and **Other (Custom name)** → Name it "Portfolio Backend"
5. Copy the 16-character password
6. Paste it in `.env` as `EMAIL_PASS`

### 4. Update Your Email in `.env`
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

### 5. Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 📡 API Endpoints

### `POST /api/contact`
Send a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to work with you!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Message sent successfully! I will get back to you soon."
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

### `GET /api/health`
Check if the server is running.

## 🔒 Security Features

- **CORS**: Only accepts requests from your frontend URL
- **Rate Limiting**: Max 5 requests per 15 minutes per IP
- **Input Validation**: Validates name, email, and message format
- **Sanitization**: Prevents injection attacks

## 🌐 Deployment

### Deploy to Render (Free)
1. Push your code to GitHub
2. Go to [Render.com](https://render.com) → New → Web Service
3. Connect your repo, select `backend` folder
4. Add environment variables from `.env`
5. Deploy!

### Deploy to Railway (Free)
1. Go to [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. Add environment variables
5. Set root directory to `backend`
6. Deploy!

## 🐛 Troubleshooting

**"Email service verification failed"**
- Check your Gmail App Password is correct
- Ensure 2-Step Verification is enabled on your Google account

**"CORS error"**
- Update `FRONTEND_URL` in `.env` to match your frontend URL

**"Too many requests"**
- Rate limit hit. Wait 15 minutes or adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`

## 📝 Notes

- Emails are sent in HTML format matching your portfolio's terminal theme
- Plain text fallback is included for email clients that don't support HTML
- All validation errors are returned with specific field information
