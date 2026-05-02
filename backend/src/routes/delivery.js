const express = require('express');
const router = express.Router();
const {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
} = require('../controllers/deliveryController');

// POST /api/delivery - Create new delivery note
router.post('/', createDelivery);

// GET /api/delivery - Get all delivery notes
router.get('/', getAllDeliveries);

// GET /api/delivery/:id - Get single delivery note
router.get('/:id', getDeliveryById);

module.exports = router;
