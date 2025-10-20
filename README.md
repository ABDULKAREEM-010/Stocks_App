# 📈 Signalist - Stock Market Tracking Application

A modern, full-stack stock market tracking application built with Next.js 15, featuring real-time stock data, AI-powered email summaries, and comprehensive watchlist management.

## ✨ Features

### 🔐 Authentication
- Secure sign-up and sign-in with Better Auth
- Session management with MongoDB
- Protected routes and user profiles
- Personalized user experience

### 📊 Stock Data & Visualization
- Real-time stock data from Finnhub API
- Interactive TradingView charts and widgets
- Market overview, heatmaps, and technical analysis
- Company profiles and financial data
- Search functionality with autocomplete

### ⭐ Watchlist Management
- Add/remove stocks to personal watchlist
- Visual star indicators (filled/unfilled)
- Real-time price updates and change percentages
- Comprehensive watchlist page with table view
- Click-to-view stock details

### 🤖 AI-Powered Features (via Inngest)
- Personalized welcome emails on sign-up (Gemini AI)
- Daily news summaries based on watchlist stocks
- AI-generated market insights
- Automated email delivery via Nodemailer

### 🎨 User Experience
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Toast notifications for user feedback
- Optimistic UI updates
- Loading states and error handling

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router, Server Components)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- TradingView widgets

**Backend:**
- Next.js API Routes
- MongoDB with Mongoose
- Better Auth (authentication)
- Inngest (background jobs)

**External APIs:**
- Finnhub API (stock market data)
- Google Gemini AI (content generation)
- Nodemailer (email delivery)

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ABDULKAREEM-010/Stocks_App.git
cd stocks-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/stocks_app?retryWrites=true&w=majority

# Better Auth Configuration
BETTER_AUTH_SECRET=your-random-secret-key-minimum-32-characters
BETTER_AUTH_URL=http://localhost:3000

# Finnhub API (Stock Market Data)
FINNHUB_API_KEY=your-finnhub-api-key
NEXT_PUBLIC_FINNHUB_API_KEY=your-finnhub-api-key

# Gemini AI API (For Inngest Email Generation)
GEMINI_API_KEY=your-gemini-api-key

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=your-inngest-event-key

# Nodemailer (Email Sending)
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your-app-specific-password

# Node Environment
NODE_ENV=development
```

**Get API Keys:**
- [Finnhub API Key](https://finnhub.io/register) - Free tier available
- [Gemini AI API Key](https://makersuite.google.com/app/apikey) - Free
- [Gmail App Password](https://myaccount.google.com/apppasswords) - For Nodemailer

4. **Start the development servers:**

**Terminal 1 - Next.js:**
```bash
npm run dev
```

**Terminal 2 - Inngest:**
```bash
npx inngest-cli@latest dev
```

5. **Access the application:**
- App: http://localhost:3000
- Inngest Dashboard: http://localhost:8288

## 🧪 Testing

Run the pre-flight check:
```bash
node test-app.js
```

For comprehensive testing, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## 📁 Project Structure

```
stocks-app/
├── app/
│   ├── (auth)/              # Auth pages (sign-in, sign-up)
│   ├── (root)/              # Main app pages
│   │   ├── stocks/[symbol]/ # Stock detail pages
│   │   ├── watchlist/       # Watchlist page
│   │   └── page.tsx         # Dashboard
│   ├── api/
│   │   ├── auth/            # Auth endpoints
│   │   └── inngest/         # Inngest webhook
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn components
│   ├── SearchCommand.tsx    # Stock search dialog
│   ├── WatchlistButton.tsx  # Add/remove from watchlist
│   ├── WatchlistTable.tsx   # Watchlist table view
│   ├── Header.tsx           # App header
│   └── ...
├── lib/
│   ├── actions/             # Server actions
│   │   ├── auth.action.ts
│   │   ├── finnhub.action.ts
│   │   ├── watchlist.action.ts
│   │   └── user.action.ts
│   ├── better-auth/         # Auth configuration
│   ├── inngest/             # Inngest functions
│   │   ├── client.ts
│   │   ├── functions.ts
│   │   └── prompts.ts
│   ├── nodemailer/          # Email templates
│   ├── constants.ts         # App constants
│   └── utils.ts             # Utility functions
├── database/
│   ├── models/              # Mongoose models
│   │   └── watchlist.model.ts
│   └── mongoose.ts          # DB connection
├── hooks/                   # Custom React hooks
├── middleware/              # Next.js middleware
└── public/                  # Static assets
```

## 🔑 Key Features Explained

### Watchlist Management
Users can add stocks to their watchlist from:
- Search dialog (star icon)
- Individual stock pages (button)

The watchlist is stored in MongoDB and synced across all views. Stars show filled (yellow) when in watchlist, unfilled (gray) otherwise.

### Daily News Emails
Every day at noon (12:00 PM), Inngest triggers a function that:
1. Fetches all users from the database
2. Gets each user's watchlist stocks
3. Fetches news for those stocks from Finnhub
4. Uses Gemini AI to generate a personalized summary
5. Sends emails to all users

### Search Functionality
- Type `Cmd/Ctrl + K` to open search
- Shows popular stocks by default
- Real-time search with 300ms debounce
- Results enriched with watchlist status
- Click to navigate to stock details

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
2. **Import to Vercel**
3. **Set environment variables in Vercel dashboard**
4. **Deploy!**

### Production Checklist
- [ ] Set production MongoDB URL
- [ ] Configure production Inngest account
- [ ] Set production API keys
- [ ] Update `BETTER_AUTH_URL` to production domain
- [ ] Test authentication flow
- [ ] Verify email sending
- [ ] Test cron jobs

## 🐛 Troubleshooting

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for common issues and solutions.

**Quick fixes:**
- **No stocks in search:** Check `FINNHUB_API_KEY`
- **Database errors:** Verify `MONGODB_URL`
- **Emails not sending:** Check Gmail App Password
- **Inngest not running:** Start dev server: `npx inngest-cli@latest dev`

## 📝 Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**ABDULKAREEM-010**
- GitHub: [@ABDULKAREEM-010](https://github.com/ABDULKAREEM-010)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [TradingView](https://www.tradingview.com/)
- [Finnhub](https://finnhub.io/)
- [Better Auth](https://www.better-auth.com/)
- [Inngest](https://www.inngest.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**⭐ Star this repo if you find it helpful!**
