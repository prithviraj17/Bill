const express = require('express');
const router = express.Router();
const {
    createDeliveryNote,
    getAllDeliveryNotes,
    getDeliveryNoteById
} = require('../controllers/deliveryNoteController');

// POST /api/delivery-notes - Create new delivery note
router.post('/', createDeliveryNote);

// GET /api/delivery-notes - Get all delivery notes
router.get('/', getAllDeliveryNotes);

// GET /api/delivery-notes/:id - Get single delivery note
router.get('/:id', getDeliveryNoteById);

module.exports = router;
