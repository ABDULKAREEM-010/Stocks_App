# 🧪 Stock App - Complete Testing Guide

This document provides a comprehensive testing checklist to verify all features of your Stock Market application are working correctly.

## 📋 Pre-Testing Setup

### Required Environment Variables
Create a `.env.local` file in the root directory with:

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

### Start Development Servers

#### Terminal 1 - Next.js Dev Server
```bash
cd c:\Users\DELL\Desktop\stocks_app\stocks-app
npm run dev
```
Expected: Server running on `http://localhost:3000`

#### Terminal 2 - Inngest Dev Server
```bash
cd c:\Users\DELL\Desktop\stocks_app\stocks-app
npx inngest-cli@latest dev
```
Expected: Inngest running on `http://localhost:8288`

---

## 🧪 Test Checklist

### 1. ✅ Database Connection Test
- [ ] MongoDB connection string is valid
- [ ] Database connects successfully on app start
- [ ] Console shows "connected to database" message
- [ ] Collections exist: `user`, `watchlist`, `session`, `account`

**Test:** Start the app and check terminal for connection message

---

### 2. ✅ Authentication System

#### Sign Up Flow
- [ ] Navigate to `/sign-up`
- [ ] Form displays all fields:
  - Full Name
  - Email
  - Password
  - Country (dropdown)
  - Investment Goals (dropdown)
  - Risk Tolerance (dropdown)
  - Preferred Industry (dropdown)
- [ ] Fill in all fields
- [ ] Submit form
- [ ] User created in database
- [ ] Redirected to dashboard
- [ ] Welcome email sent (check Inngest dashboard)

**Expected Result:** New user account created, logged in automatically

#### Sign In Flow
- [ ] Navigate to `/sign-in`
- [ ] Form displays email and password fields
- [ ] Enter credentials
- [ ] Submit form
- [ ] Session created
- [ ] Redirected to dashboard
- [ ] User avatar shows in header

**Expected Result:** User successfully logged in

#### Session Management
- [ ] Refresh page - user stays logged in
- [ ] Check avatar in header shows user initials
- [ ] Dropdown shows user name and email
- [ ] Logout button works
- [ ] After logout, redirected to sign-in page

---

### 3. ✅ Search Functionality

#### Search Dialog
- [ ] Click "Search" in navigation or press `Cmd/Ctrl + K`
- [ ] Dialog opens
- [ ] Shows popular stocks (top 10) initially
- [ ] Stocks display: symbol, name, exchange, type
- [ ] Each stock has a star icon

#### Search Operation
- [ ] Type "AAPL" in search box
- [ ] Results appear after 300ms (debounced)
- [ ] Shows relevant results from Finnhub API
- [ ] Each result shows proper company info
- [ ] Loading spinner shows during search
- [ ] "No results found" shows for invalid queries

#### Watchlist Stars in Search
- [ ] Stars show **filled yellow** for stocks in watchlist
- [ ] Stars show **unfilled gray** for stocks not in watchlist
- [ ] Click unfilled star → turns yellow immediately
- [ ] Toast notification: "SYMBOL added to watchlist"
- [ ] Click filled star → unfills immediately
- [ ] Toast notification: "SYMBOL removed from watchlist"
- [ ] Close and reopen dialog → stars show correct state
- [ ] Clicking star doesn't navigate to stock page

**Expected Result:** Search works with real-time feedback and correct star states

---

### 4. ✅ Watchlist Functionality

#### Adding to Watchlist
- [ ] From search: Click star on any stock
- [ ] From stock page: Click "Add to Watchlist" button
- [ ] Toast notification appears
- [ ] Stock saved to MongoDB `watchlist` collection
- [ ] Star icon updates immediately

#### Removing from Watchlist
- [ ] From search: Click filled star
- [ ] From stock page: Click "Remove from Watchlist" button
- [ ] From watchlist page: Click "Remove" button
- [ ] Toast notification appears
- [ ] Stock removed from database
- [ ] UI updates immediately

#### Watchlist Page (`/watchlist`)
- [ ] Navigate to `/watchlist` from header
- [ ] Shows all user's watchlist stocks in table
- [ ] Columns display:
  - Symbol (clickable link)
  - Company name
  - Current price
  - Change % (green/red with arrows)
  - Market cap
  - Date added
  - Remove button
- [ ] Data is real-time from Finnhub API
- [ ] Remove button works
- [ ] Empty state shows when no stocks
- [ ] "Browse Stocks" button in empty state
- [ ] Stock count shows at bottom

**Expected Result:** Complete watchlist management

---

### 5. ✅ Stock Detail Pages

#### Navigation
- [ ] Click any stock symbol from search
- [ ] Click any stock symbol from watchlist
- [ ] Direct URL: `/stocks/AAPL`
- [ ] Page loads successfully

#### Page Content
- [ ] TradingView widgets load:
  - Symbol Info widget (top)
  - Advanced Chart (candle chart)
  - Baseline Chart
  - Technical Analysis
  - Company Profile
  - Company Financials
- [ ] All widgets display data
- [ ] Watchlist button shows correct state
- [ ] Button shows actual company name (not just symbol)

#### Watchlist Button on Stock Page
- [ ] Shows "Add to Watchlist" if not in watchlist
- [ ] Shows "Remove from Watchlist" if in watchlist
- [ ] Click button → state changes immediately
- [ ] Loading state shows during API call
- [ ] Toast notification appears
- [ ] Button disabled during loading
- [ ] Refresh page → state persists

**Expected Result:** Full stock details with working watchlist toggle

---

### 6. ✅ Dashboard/Home Page

#### Layout
- [ ] Navigate to `/`
- [ ] Header shows with logo, navigation, user dropdown
- [ ] TradingView widgets display:
  - Market Overview
  - Market Heatmap
  - Top Stories
  - Market Data
- [ ] All widgets load without errors

#### Navigation Items
- [ ] "Dashboard" link (active state highlighted)
- [ ] "Search" link (opens search dialog)
- [ ] "Watchlist" link (goes to watchlist page)

---

### 7. ✅ Inngest Functions

#### Setup
- [ ] Inngest dev server running on port 8288
- [ ] Visit `http://localhost:8288`
- [ ] Dashboard shows 2 functions:
  - `sign-up-email`
  - `daily-news-summary`

#### Welcome Email (Triggered on Sign Up)
- [ ] Sign up with new account
- [ ] Check Inngest dashboard → see new run
- [ ] Run shows steps:
  1. `generate-welcome-intro` (AI step)
  2. `send-welcome-email` (email step)
- [ ] Check email inbox for welcome email
- [ ] Email contains:
  - User's name
  - Personalized intro (generated by Gemini AI)
  - Investment profile details

**Test Trigger:**
```
POST http://localhost:3000/api/inngest
Event: app/user.created
Data: {
  email: "test@example.com",
  name: "Test User",
  country: "US",
  investmentGoals: "Growth",
  riskTolerance: "Medium",
  preferredIndustry: "Technology"
}
```

#### Daily News Summary (Cron: Daily at Noon)
- [ ] Runs automatically at 12:00 PM daily
- [ ] Check Inngest dashboard for runs
- [ ] Run shows steps:
  1. `get-all-users` - Fetches users
  2. `fetch-user-news` - Gets watchlist stocks & news
  3. `summarize-news-{email}` - AI summarization per user
  4. `send-news-emails` - Sends emails
- [ ] Users receive email with:
  - Today's date
  - News from their watchlist stocks
  - AI-generated summary (Gemini)
  - Fallback to general market news if no watchlist

**Manual Test Trigger:**
```bash
# In Inngest dashboard
Click "Send test event"
Event: app/send.daily.news
```

---

### 8. ✅ Error Handling

#### Network Errors
- [ ] Disconnect internet
- [ ] Try searching stocks → shows error toast
- [ ] Try adding to watchlist → shows error toast
- [ ] Reconnect → functionality restores

#### Invalid API Keys
- [ ] Remove `FINNHUB_API_KEY` temporarily
- [ ] Search stocks → empty results
- [ ] No app crash, graceful degradation

#### Authentication Errors
- [ ] Try accessing `/watchlist` without login
- [ ] Redirects to `/sign-in`
- [ ] After login, redirects back

#### Database Errors
- [ ] Invalid MongoDB connection
- [ ] App shows connection error
- [ ] Doesn't crash, shows user-friendly message

---

### 9. ✅ UI/UX Testing

#### Responsive Design
- [ ] Desktop (1920x1080) - all elements visible
- [ ] Tablet (768px) - navigation adapts
- [ ] Mobile (375px) - hamburger menu works
- [ ] Watchlist table scrolls horizontally on mobile
- [ ] Search dialog works on all sizes

#### Dark Mode Support
- [ ] App supports dark theme
- [ ] TradingView widgets use dark theme
- [ ] Tables, forms, buttons have dark styles
- [ ] Text remains readable

#### Loading States
- [ ] Search shows loading spinner
- [ ] Watchlist button shows "Adding..." / "Removing..."
- [ ] Disabled state prevents double-clicks
- [ ] Skeleton loaders where appropriate

#### Toast Notifications
- [ ] Success toasts (green) for successful actions
- [ ] Error toasts (red) for failures
- [ ] Toasts auto-dismiss after 3-5 seconds
- [ ] Multiple toasts stack properly

---

### 10. ✅ Performance Testing

#### Page Load Speed
- [ ] Home page loads in < 2 seconds
- [ ] Stock detail page loads in < 3 seconds
- [ ] Watchlist page loads in < 2 seconds

#### API Response Times
- [ ] Search results appear in < 500ms
- [ ] Watchlist operations complete in < 1 second
- [ ] Finnhub API calls cached appropriately

#### Database Queries
- [ ] Watchlist enrichment uses single query
- [ ] No N+1 query problems
- [ ] Indexes on userId and symbol

---

## 🐛 Common Issues & Solutions

### Issue 1: "MONGODB_URL not defined"
**Solution:** Create `.env.local` file with MongoDB connection string

### Issue 2: Search shows no results
**Solution:** Check `FINNHUB_API_KEY` is set correctly

### Issue 3: Inngest functions don't run
**Solution:** 
- Start Inngest dev server: `npx inngest-cli@latest dev`
- Check Next.js is running on port 3000
- Check `GEMINI_API_KEY` is set

### Issue 4: Emails not sending
**Solution:** 
- Check `NODEMAILER_EMAIL` and `NODEMAILER_PASSWORD`
- Use Gmail App Password (not regular password)
- Enable "Less secure app access" in Gmail settings

### Issue 5: Stars don't show correct state
**Solution:** Already fixed - stars now check actual watchlist status

### Issue 6: Authentication errors
**Solution:** Check `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are set

---

## 📊 Expected Database Collections

After testing, your MongoDB should have:

### `user` Collection
```json
{
  "_id": "...",
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "emailVerified": false,
  "image": null,
  "createdAt": "2025-10-20T...",
  "updatedAt": "2025-10-20T..."
}
```

### `watchlist` Collection
```json
{
  "_id": "...",
  "userId": "user_id",
  "symbol": "AAPL",
  "company": "Apple Inc.",
  "addedAt": "2025-10-20T..."
}
```

### `session` Collection
```json
{
  "_id": "...",
  "userId": "user_id",
  "expiresAt": "2025-11-20T...",
  "token": "...",
  "ipAddress": "...",
  "userAgent": "..."
}
```

---

## ✅ Final Verification

All tests passed? Your app is working correctly! 🎉

### Summary Checklist:
- [ ] All environment variables configured
- [ ] MongoDB connected successfully
- [ ] Authentication (sign up, sign in, logout) works
- [ ] Search functionality with real-time results
- [ ] Watchlist add/remove with correct star states
- [ ] Watchlist page displays all stocks
- [ ] Stock detail pages load with data
- [ ] Inngest functions registered and running
- [ ] Welcome emails sent on sign up
- [ ] Daily news emails (manual test)
- [ ] Error handling graceful
- [ ] Responsive design works
- [ ] No compilation errors
- [ ] No runtime errors in console

---

## 🚀 Next Steps

If all tests pass:
1. ✅ Deploy to production (Vercel)
2. ✅ Set up production Inngest account
3. ✅ Configure production environment variables
4. ✅ Set up MongoDB Atlas production cluster
5. ✅ Enable cron jobs for daily emails

---

**Need Help?**
- Check browser console for errors
- Check terminal for server logs
- Check Inngest dashboard for function runs
- Verify all environment variables are set correctly
