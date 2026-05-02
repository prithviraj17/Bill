const mongoose = require('mongoose');

const deliveryNoteSchema = new mongoose.Schema({
    dcNumber: {
        type: String,
        required: [true, 'DC Number is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    quality: {
        type: String,
        required: [true, 'Quality is required'],
        trim: true
    },
    vehicleNumber: {
        type: String,
        required: [true, 'Vehicle number is required'],
        trim: true
    },
    driverName: {
        type: String,
        required: [true, 'Driver name is required'],
        trim: true
    },
    bags: [{
        bagNumber: String,
        grossWeight: Number,
        netWeight: Number
    }],
    totalGrossWeight: {
        type: Number,
        default: 0
    },
    totalNetWeight: {
        type: Number,
        default: 0
    },
    totalBags: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
deliveryNoteSchema.index({ dcNumber: 1 });
deliveryNoteSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DeliveryNote', deliveryNoteSchema);
