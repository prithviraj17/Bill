require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const deliveryRouter = require('./routes/delivery');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/delivery', deliveryRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Yarn Delivery Note API is running',
        timestamp: new Date().toISOString(),
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL database');

        // Create tables if they don't exist
        const schemaSQL = `
      CREATE TABLE IF NOT EXISTS delivery (
        id SERIAL PRIMARY KEY,
        dc_no VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        customer VARCHAR(255) NOT NULL,
        quality VARCHAR(100) NOT NULL,
        vehicle_no VARCHAR(50) NOT NULL,
        driver_name VARCHAR(100) NOT NULL,
        total_gross DECIMAL(10, 2) DEFAULT 0,
        total_net DECIMAL(10, 2) DEFAULT 0,
        total_bags INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bags (
        id SERIAL PRIMARY KEY,
        delivery_id INTEGER REFERENCES delivery(id) ON DELETE CASCADE,
        bag_no VARCHAR(50),
        gross DECIMAL(10, 2),
        net DECIMAL(10, 2)
      );

      CREATE INDEX IF NOT EXISTS idx_delivery_dc_no ON delivery(dc_no);
      CREATE INDEX IF NOT EXISTS idx_delivery_created_at ON delivery(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_bags_delivery_id ON bags(delivery_id);
    `;

        await pool.query(schemaSQL);
        console.log('✅ Database tables initialized');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📊 API available at http://localhost:${PORT}/api/delivery`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
