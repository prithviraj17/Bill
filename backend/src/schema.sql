-- Create delivery table
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

-- Create bags table
CREATE TABLE IF NOT EXISTS bags (
  id SERIAL PRIMARY KEY,
  delivery_id INTEGER REFERENCES delivery(id) ON DELETE CASCADE,
  bag_no VARCHAR(50),
  gross DECIMAL(10, 2),
  net DECIMAL(10, 2)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_delivery_dc_no ON delivery(dc_no);
CREATE INDEX IF NOT EXISTS idx_delivery_created_at ON delivery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bags_delivery_id ON bags(delivery_id);
