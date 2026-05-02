# Quick Start Guide - RK TOP YARN Delivery Note System

## 🚀 START HERE

Your application is **ALREADY BUILT** and partially running!

### Current Status:
✅ **Frontend**: Running at http://localhost:5174/  
❌ **Backend**: Not running (needs MongoDB)

---

## Option 1: Use Without Database (QUICK)

The frontend is already working! You can:
- ✅ Fill out delivery forms
- ✅ Generate bills
- ✅ Print bills
- ✅ Download PDFs
- ❌ Cannot save to database
- ❌ Cannot view history

**Just open**: http://localhost:5174/ in your browser

---

## Option 2: Enable Full Features (RECOMMENDED)

### Step 1: Install MongoDB (5 minutes)

**Easiest Method - MongoDB Atlas (Cloud):**

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Click "Build a Database" → Choose FREE tier
4. Create username and password
5. Click "Add IP Address" → Choose "Allow Access from Anywhere"
6. Click "Finish and Close"
7. Click "Connect" → Choose "Connect your application"
8. Copy the connection string (looks like: `mongodb+srv://username:password@cluster...`)

### Step 2: Configure Backend

1. Open `d:\Bill\backend\.env` in a text editor
2. Replace the MONGO_URI line with your Atlas connection string:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@your-cluster.mongodb.net/yarn-delivery
```

3. Save the file

### Step 3: Start Backend

Open a NEW terminal/PowerShell window:

```powershell
cd d:\Bill\backend
npm start
```

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server is running on http://localhost:5000
```

### Step 4: Use the Application

1. Open browser: http://localhost:5174/
2. Fill out the form
3. Click "Save & Generate" to save to database
4. Click "View History" to see saved records

---

## 📱 How to Use the App

### Creating a Delivery Note:

1. **Enter Header Details:**
   - DC Number (e.g., DC-001)
   - Date (auto-filled)
   - Customer Name (e.g., ABC Textiles)
   - Quality (e.g., Premium Cotton)
   - Vehicle Number (e.g., TN-01-AB-1234)
   - Driver Name

2. **Enter Bag Details:**
   - Fill in Bag Number, Gross Weight, Net Weight
   - Up to 30 bags
   - Totals calculate automatically!

3. **Generate Bill:**
   - Click "Generate Bill" (preview only)
   - OR "Save & Generate" (saves to database)

4. **Print or Download:**
   - 🖨️ Print Bill → Opens print dialog
   - 📄 Download PDF → Downloads PDF file
   - ← Create New → Back to form

---

## 🎨 Features

✅ Professional bill layout  
✅ Two-column bag table (1-15 left, 16-30 right)  
✅ Auto-calculations (totals update as you type)  
✅ Print-optimized output  
✅ High-quality PDF export  
✅ Save to database (with MongoDB)  
✅ View history of all delivery notes  
✅ Modern gradient UI design  
✅ Responsive on mobile/tablet  

---

## 🆘 Troubleshooting

### Frontend not loading?
```powershell
cd d:\Bill\frontend
npm run dev
```

### Backend connection error?
- Check MongoDB is running
- Verify `.env` file has correct MONGO_URI
- Check internet connection (for Atlas)

### Want to stop the servers?
- Press `Ctrl + C` in the terminal windows

---

## 📂 Project Files

```
d:\Bill\
├── backend/          ← Node.js + Express API
├── frontend/         ← React application
└── README.md         ← Full documentation
```

---

**Need help?** Check the full README.md for detailed documentation.
