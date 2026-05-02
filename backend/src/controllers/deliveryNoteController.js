const DeliveryNote = require('../models/DeliveryNote');

// Create a new delivery note
exports.createDeliveryNote = async (req, res) => {
    try {
        const {
            dcNumber,
            date,
            customerName,
            quality,
            vehicleNumber,
            driverName,
            bags
        } = req.body;

        // Validate required fields
        if (!dcNumber || !date || !customerName || !quality || !vehicleNumber || !driverName) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled'
            });
        }

        // Filter out empty bag entries and calculate totals
        const validBags = bags.filter(bag =>
            bag.bagNumber || bag.grossWeight || bag.netWeight
        ).map(bag => ({
            bagNumber: bag.bagNumber || '',
            grossWeight: parseFloat(bag.grossWeight) || 0,
            netWeight: parseFloat(bag.netWeight) || 0
        }));

        if (validBags.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one bag entry is required'
            });
        }

        // Calculate totals
        const totalGrossWeight = validBags.reduce((sum, bag) => sum + bag.grossWeight, 0);
        const totalNetWeight = validBags.reduce((sum, bag) => sum + bag.netWeight, 0);
        const totalBags = validBags.length;

        // Create delivery note
        const deliveryNote = new DeliveryNote({
            dcNumber,
            date: new Date(date),
            customerName,
            quality,
            vehicleNumber,
            driverName,
            bags: validBags,
            totalGrossWeight: parseFloat(totalGrossWeight.toFixed(2)),
            totalNetWeight: parseFloat(totalNetWeight.toFixed(2)),
            totalBags
        });

        await deliveryNote.save();

        res.status(201).json({
            success: true,
            message: 'Delivery note created successfully',
            data: deliveryNote
        });
    } catch (error) {
        console.error('Error creating delivery note:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating delivery note',
            error: error.message
        });
    }
};

// Get all delivery notes
exports.getAllDeliveryNotes = async (req, res) => {
    try {
        const deliveryNotes = await DeliveryNote.find()
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            success: true,
            count: deliveryNotes.length,
            data: deliveryNotes
        });
    } catch (error) {
        console.error('Error fetching delivery notes:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching delivery notes',
            error: error.message
        });
    }
};

// Get single delivery note by ID
exports.getDeliveryNoteById = async (req, res) => {
    try {
        const { id } = req.params;

        const deliveryNote = await DeliveryNote.findById(id).select('-__v');

        if (!deliveryNote) {
            return res.status(404).json({
                success: false,
                message: 'Delivery note not found'
            });
        }

        res.status(200).json({
            success: true,
            data: deliveryNote
        });
    } catch (error) {
        console.error('Error fetching delivery note:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching delivery note',
            error: error.message
        });
    }
};
