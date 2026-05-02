# PostgreSQL Setup Guide for Yarn Delivery Note System

## 📋 Prerequisites

You need PostgreSQL installed on your system. Choose one of the options below:

---

## Option 1: Install PostgreSQL Locally (Windows)

### Step 1: Download PostgreSQL
1. Go to: https://www.postgresql.org/download/windows/
2. Download the **PostgreSQL installer** (recommended: version 15 or higher)
3. Run the installer

### Step 2: Installation Steps
1. **Installation Directory**: Leave as default (C:\Program Files\PostgreSQL\16)
2. **Select Components**: Install all components (PostgreSQL Server, pgAdmin 4, Command Line Tools)
3. **Data Directory**: Leave as default
4. **Password**: Set a password for the postgres user (remember this!)
5. **Port**: Leave as default (5432)
6. **Locale**: Leave as default

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
psql --version
```

### Step 4: Create Database
```powershell
# Login to PostgreSQL
psql -U postgres

# Create database (inside psql prompt)
CREATE DATABASE yarn_delivery;

# Verify database was created
\l

# Exit psql
\q
```

---

## Option 2: Use PostgreSQL Docker (Easier)

### Step 1: Install Docker
Download from: https://www.docker.com/products/docker-desktop/

### Step 2: Run PostgreSQL Container
```powershell
docker run --name yarn-postgres `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=yarn_delivery `
  -p 5432:5432 `
  -d postgres:16
```

### Step 3: Verify Container is Running
```powershell
docker ps
```

---

## Option 3: Use Cloud PostgreSQL (Supabase - Free)

### Step 1: Create Account
1. Go to: https://supabase.com
2. Sign up for free account

### Step 2: Create Project
1. Click "New Project"
2. Choose free tier
3. Set database password
4. Wait for project to be created

### Step 3: Get Connection String
1. Go to Project Settings → Database
2. Copy the **Connection string** (URI format)
3. It looks like: `postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres`

---

## 🔧 Configure Backend

### Update `.env` File

Open `d:\Bill\backend\.env` and update the `DATABASE_URL`:

**For Local PostgreSQL:**
```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/yarn_delivery
```

**For Docker PostgreSQL:**
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/yarn_delivery
```

**For Supabase Cloud:**
```env
PORT=5000
DATABASE_URL=postgresql://postgres.xxxxx:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

⚠️ **Important**: Replace `YOUR_PASSWORD` with your actual password!

---

## 🚀 Start the Application

### Step 1: Install Backend Dependencies
```powershell
cd d:\Bill\backend
npm install
```

### Step 2: Start Backend Server
```powershell
npm start
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
🚀 Server is running on http://localhost:5000
📊 API available at http://localhost:5000/api/delivery
```

### Step 3: Start Frontend (in a new terminal)
```powershell
cd d:\Bill\frontend
npm run dev
```

---

## 🗄️ Database Schema

The backend will automatically create these tables on first run:

### Table: `delivery`
- `id` - Auto-increment primary key
- `dc_no` - Delivery challan number
- `date` - Delivery date
- `customer` - Customer name
- `quality` - Yarn quality
- `vehicle_no` - Vehicle number
- `driver_name` - Driver name
- `total_gross` - Total gross weight
- `total_net` - Total net weight
- `total_bags` - Total number of bags
- `created_at` - Timestamp

### Table: `bags`
- `id` - Auto-increment primary key
- `delivery_id` - Foreign key to delivery table
- `bag_no` - Bag number
- `gross` - Gross weight
- `net` - Net weight

---

## 🔍 Verify Database

### Check if tables were created:
```powershell
psql -U postgres -d yarn_delivery

# List tables
\dt

# View delivery records
SELECT * FROM delivery;

# View bags records
SELECT * FROM bags;

# Exit
\q
```

---

## ❌ Troubleshooting

### Error: "connect ECONNREFUSED"
- PostgreSQL is not running
- Start PostgreSQL service or Docker container

### Error: "password authentication failed"
- Wrong password in `.env` file
- Check your PostgreSQL password

### Error: "database does not exist"
- Create the database manually:
  ```powershell
  psql -U postgres
  CREATE DATABASE yarn_delivery;
  ```

---

## 📊 pgAdmin (Optional GUI)

If you installed PostgreSQL with pgAdmin:
1. Open pgAdmin 4
2. Connect to PostgreSQL server
3. Navigate to: Databases → yarn_delivery → Tables
4. Right-click on tables → View/Edit Data

---

## ✅ Quick Test

Test the API with PowerShell:
```powershell
# Test health endpoint
Invoke-WebRequest -Uri http://localhost:5000/api/health

# Test create delivery
$body = @{
    dcNo = "DC-001"
    date = "2026-04-28"
    customer = "Test Customer"
    quality = "Premium Cotton"
    vehicleNo = "TN-01-AB-1234"
    driverName = "John Doe"
    totalGross = 100.50
    totalNet = 99.00
    totalBags = 2
    bags = @(
        @{ bagNo = "B001"; gross = 50.25; net = 49.50 },
        @{ bagNo = "B002"; gross = 50.25; net = 49.50 }
    )
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/delivery `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

**Need help?** Check the main README.md or the error logs in the terminal.
