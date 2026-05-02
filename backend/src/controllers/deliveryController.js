const pool = require('../db');

// Create a new delivery note
exports.createDelivery = async (req, res) => {
    try {
        const {
            dcNo,
            date,
            customer,
            quality,
            vehicleNo,
            driverName,
            totalGross,
            totalNet,
            totalBags,
            bags,
        } = req.body;

        // Validate required fields
        if (!dcNo || !date || !customer || !quality || !vehicleNo || !driverName) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled',
            });
        }

        // Filter out empty bag entries
        const validBags = bags.filter(
            (bag) => bag.bagNo || bag.gross || bag.net
        );

        if (validBags.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one bag entry is required',
            });
        }

        // Insert into delivery table
        const result = await pool.query(
            `INSERT INTO delivery 
       (dc_no, date, customer, quality, vehicle_no, driver_name, total_gross, total_net, total_bags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id`,
            [
                dcNo,
                date,
                customer,
                quality,
                vehicleNo,
                driverName,
                totalGross,
                totalNet,
                totalBags,
            ]
        );

        const deliveryId = result.rows[0].id;

        // Insert bags
        for (let bag of validBags) {
            await pool.query(
                `INSERT INTO bags (delivery_id, bag_no, gross, net)
         VALUES ($1, $2, $3, $4)`,
                [deliveryId, bag.bagNo, bag.gross || 0, bag.net || 0]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Delivery note saved successfully',
            data: { id: deliveryId },
        });
    } catch (err) {
        console.error('Error creating delivery:', err);
        res.status(500).json({
            success: false,
            message: 'Server error while creating delivery note',
            error: err.message,
        });
    }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await pool.query(
            'SELECT * FROM delivery ORDER BY created_at DESC'
        );

        // Get bags for each delivery
        for (let d of deliveries.rows) {
            const bags = await pool.query(
                'SELECT * FROM bags WHERE delivery_id=$1',
                [d.id]
            );
            d.bags = bags.rows;
        }

        res.json({
            success: true,
            count: deliveries.rows.length,
            data: deliveries.rows,
        });
    } catch (err) {
        console.error('Error fetching deliveries:', err);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching deliveries',
            error: err.message,
        });
    }
};

// Get single delivery by ID
exports.getDeliveryById = async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await pool.query(
            'SELECT * FROM delivery WHERE id = $1',
            [id]
        );

        if (delivery.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Delivery note not found',
            });
        }

        const bags = await pool.query(
            'SELECT * FROM bags WHERE delivery_id = $1',
            [id]
        );

        const deliveryData = delivery.rows[0];
        deliveryData.bags = bags.rows;

        res.json({
            success: true,
            data: deliveryData,
        });
    } catch (err) {
        console.error('Error fetching delivery:', err);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching delivery',
            error: err.message,
        });
    }
};
