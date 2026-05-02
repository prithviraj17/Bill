# RK TOP YARN - Delivery Note System

A complete full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for generating professional Yarn Delivery Notes with print and PDF export capabilities.

## 🎯 Features

- ✅ **Professional Form Input** - Enter delivery details with validation
- ✅ **Dynamic Bag Entry** - Up to 30 bags with auto-calculations
- ✅ **Two-Column Bill Layout** - Traditional printed bill format (1-15 left, 16-30 right)
- ✅ **Print Functionality** - Clean print output using window.print()
- ✅ **PDF Export** - Download bills as PDF using html2canvas + jsPDF
- ✅ **Save & History** - Store and view past delivery notes (requires MongoDB)
- ✅ **Modern UI** - Professional gradient design with smooth animations
- ✅ **Responsive Design** - Works on desktop and mobile devices

## 📁 Project Structure

```
d:\Bill\
├── backend/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── models/
│   │   │   └── DeliveryNote.js   # MongoDB schema
│   │   ├── routes/
│   │   │   └── deliveryNotes.js  # API routes
│   │   ├── controllers/
│   │   │   └── deliveryNoteController.js
│   │   └── server.js             # Express server
│   ├── package.json
│   └── .env
│
├── frontend/                     # React Frontend (Vite)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeliveryForm.jsx  # Input form component
│   │   │   ├── DeliveryBill.jsx  # Bill display component
│   │   │   └── HistoryList.jsx   # Saved records view
│   │   ├── services/
│   │   │   └── api.js            # API calls
│   │   ├── utils/
│   │   │   └── calculations.js   # Helper functions
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Styling
│   │   ├── index.css             # Global & print styles
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Installation Steps

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud) - [Free Tier](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** (comes with Node.js)

### Step 1: Install MongoDB

**Option A: Local MongoDB Installation**

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install it on your Windows system
3. MongoDB will start automatically as a Windows service
4. Verify installation by running: `mongosh` in terminal

**Option B: MongoDB Atlas (Cloud - Recommended for beginners)**

1. Create a free account at: https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Whitelist your IP address (0.0.0.0/0 for all IPs)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd d:\Bill\backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file with your MongoDB connection string
```

**Edit `backend/.env` file:**

For **Local MongoDB**:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/yarn-delivery
```

For **MongoDB Atlas**:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@your-cluster.mongodb.net/yarn-delivery
```

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory
cd d:\Bill\frontend

# Install dependencies (already done)
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
# Terminal 1 - Backend
cd d:\Bill\backend
npm start
```

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server is running on http://localhost:5000
📊 API available at http://localhost:5000/api/delivery-notes
```

### Start Frontend Development Server

```bash
# Terminal 2 - Frontend
cd d:\Bill\frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to: **http://localhost:5173/** (or the port shown in terminal)

## 📋 How to Use

### 1. Create a Delivery Note

1. Fill in the header fields:
   - DC Number
   - Date (auto-filled with today's date)
   - Customer Name (M/S)
   - Quality
   - Vehicle Number
   - Driver Name

2. Enter bag details in the table (up to 30 bags):
   - Bag Number
   - Gross Weight (G.WT)
   - Net Weight (NET WT)

3. **Totals are calculated automatically** as you type!

### 2. Generate Bill

You have two options:

- **"Generate Bill"** - Preview the bill without saving to database
- **"Save & Generate"** - Save to database AND preview the bill

### 3. Print or Download

Once the bill is generated:

- **🖨️ Print Bill** - Opens browser print dialog (prints only the bill)
- **📄 Download PDF** - Downloads the bill as a PDF file
- **← Create New** - Go back to form to create another note

### 4. View History

Click **"View History"** tab to see all saved delivery notes (requires MongoDB).

## 🔌 API Endpoints

### Backend API (http://localhost:5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/delivery-notes` | Create new delivery note |
| GET | `/api/delivery-notes` | Get all delivery notes |
| GET | `/api/delivery-notes/:id` | Get single delivery note |
| GET | `/api/health` | Health check |

### Example API Request (Create Delivery Note)

```json
POST http://localhost:5000/api/delivery-notes

{
  "dcNumber": "DC-001",
  "date": "2026-04-28",
  "customerName": "ABC Textiles",
  "quality": "Premium Cotton",
  "vehicleNumber": "TN-01-AB-1234",
  "driverName": "John Doe",
  "bags": [
    { "bagNumber": "B001", "grossWeight": 50.5, "netWeight": 49.8 },
    { "bagNumber": "B002", "grossWeight": 51.2, "netWeight": 50.5 }
  ]
}
```

## 🎨 Features Breakdown

### Frontend Components

1. **DeliveryForm.jsx**
   - Form validation
   - 30-row dynamic bag table
   - Real-time total calculations
   - Error handling

2. **DeliveryBill.jsx**
   - Professional bill layout
   - Two-column format (1-15, 16-30)
   - Company branding
   - Signature section

3. **HistoryList.jsx**
   - View all saved delivery notes
   - Click to view previous bills
   - Responsive table layout

### Styling

- **Modern gradient design** (purple/indigo theme)
- **Card-based layout** with shadows
- **Smooth animations** on hover and focus
- **Print-optimized CSS** with @media print
- **Responsive design** for mobile devices

### Print & PDF

- **Print**: Uses `window.print()` with CSS `@media print` rules
- **PDF**: Uses `html2canvas` to capture bill as image, then `jsPDF` to create PDF
- Both maintain exact layout and formatting

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **html2canvas** - Convert HTML to canvas image
- **jsPDF** - Generate PDF files
- **Plain CSS** - Styling with print support

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🔧 Troubleshooting

### MongoDB Connection Error

If you see: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running
2. For local MongoDB: Start MongoDB service
   ```bash
   # Windows
   net start MongoDB
   ```
3. For Atlas: Check your connection string in `.env`

### Port Already in Use

If port 5173 or 5000 is already in use:

**Frontend:** Vite will automatically use the next available port (5174, 5175, etc.)

**Backend:** Change the port in `backend/.env`:
```env
PORT=5001
```

Then update the API URL in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

### PDF Generation Issues

If PDF download fails:
1. Check browser console for errors
2. Ensure the bill is fully rendered before clicking download
3. Try using Print → Save as PDF as alternative

## 📝 Notes

- **Without MongoDB**: You can still use the form, generate bills, print, and download PDF. Only save/history features won't work.
- **With MongoDB**: All features work including saving and viewing history.
- **Print Layout**: The bill is optimized for A4 paper size.
- **PDF Quality**: Uses 2x scale for high-quality PDF output.

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add company logo to bill header
- [ ] Email delivery notes to customers
- [ ] Add search/filter in history
- [ ] Export to Excel
- [ ] Multi-currency support
- [ ] User authentication
- [ ] Dashboard with analytics

## 📄 License

This project is for educational and commercial use.

## 👨‍💻 Support

If you encounter any issues or have questions, please check:
1. MongoDB is running
2. All dependencies are installed (`npm install`)
3. `.env` file is properly configured
4. Browser console for frontend errors
5. Terminal output for backend errors

---

**Built with ❤️ using MERN Stack**
