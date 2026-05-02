import React, { useState } from 'react';
import { calculateTotals, generateInitialBags, validateFormData } from '../utils/calculations';

const DeliveryForm = ({ onSubmit, onSaveAndSubmit }) => {
    const [formData, setFormData] = useState({
        dcNumber: '',
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        quality: '',
        vehicleNumber: '',
        driverName: ''
    });

    const [bags, setBags] = useState(generateInitialBags());
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Handle form field changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle bag field changes
    const handleBagChange = (index, field, value) => {
        setBags(prev => {
            const newBags = [...prev];
            newBags[index] = {
                ...newBags[index],
                [field]: value
            };
            return newBags;
        });
    };

    // Calculate totals
    const totals = calculateTotals(bags);

    // Handle generate bill (without saving)
    const handleGenerateBill = (e) => {
        e.preventDefault();
        const validationErrors = validateFormData(formData, bags);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        onSubmit({ formData, bags, totals });
    };

    // Handle save and generate bill
    const handleSaveAndGenerate = async (e) => {
        e.preventDefault();
        const validationErrors = validateFormData(formData, bags);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSaving(true);

        try {
            await onSaveAndSubmit({ formData, bags, totals });
        } catch (error) {
            setErrors({ submit: error.message || 'Failed to save delivery note' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="delivery-form">
            <h2>Create Delivery Note</h2>

            <form onSubmit={handleGenerateBill}>
                {/* Header Fields */}
                <div className="form-header">
                    <div className="form-group">
                        <label htmlFor="dcNumber">DC Number *</label>
                        <input
                            type="text"
                            id="dcNumber"
                            name="dcNumber"
                            value={formData.dcNumber}
                            onChange={handleFormChange}
                            className={errors.dcNumber ? 'error' : ''}
                        />
                        {errors.dcNumber && <span className="error-text">{errors.dcNumber}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date *</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleFormChange}
                            className={errors.date ? 'error' : ''}
                        />
                        {errors.date && <span className="error-text">{errors.date}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="customerName">Customer Name (M/S) *</label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleFormChange}
                            className={errors.customerName ? 'error' : ''}
                        />
                        {errors.customerName && <span className="error-text">{errors.customerName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="quality">Quality *</label>
                        <input
                            type="text"
                            id="quality"
                            name="quality"
                            value={formData.quality}
                            onChange={handleFormChange}
                            className={errors.quality ? 'error' : ''}
                        />
                        {errors.quality && <span className="error-text">{errors.quality}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="vehicleNumber">Vehicle Number *</label>
                        <input
                            type="text"
                            id="vehicleNumber"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleFormChange}
                            className={errors.vehicleNumber ? 'error' : ''}
                        />
                        {errors.vehicleNumber && <span className="error-text">{errors.vehicleNumber}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="driverName">Driver Name *</label>
                        <input
                            type="text"
                            id="driverName"
                            name="driverName"
                            value={formData.driverName}
                            onChange={handleFormChange}
                            className={errors.driverName ? 'error' : ''}
                        />
                        {errors.driverName && <span className="error-text">{errors.driverName}</span>}
                    </div>
                </div>

                {/* Bag Entries Table */}
                <div className="bag-table-container">
                    <h3>Bag Details (Up to 30 bags)</h3>
                    <table className="bag-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Bag Number</th>
                                <th>Gross Weight (G.WT)</th>
                                <th>Net Weight (NET WT)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bags.map((bag, index) => (
                                <tr key={index}>
                                    <td className="serial-number">{bag.serialNumber}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={bag.bagNumber}
                                            onChange={(e) => handleBagChange(index, 'bagNumber', e.target.value)}
                                            placeholder="Bag No"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={bag.grossWeight}
                                            onChange={(e) => handleBagChange(index, 'grossWeight', e.target.value)}
                                            placeholder="0.00"
                                            className={errors[`bag_${index}_gross`] ? 'error' : ''}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={bag.netWeight}
                                            onChange={(e) => handleBagChange(index, 'netWeight', e.target.value)}
                                            placeholder="0.00"
                                            className={errors[`bag_${index}_net`] ? 'error' : ''}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div className="summary-section">
                    <div className="summary-item">
                        <label>Total Bags:</label>
                        <span className="summary-value">{totals.totalBags}</span>
                    </div>
                    <div className="summary-item">
                        <label>Total Gross Weight:</label>
                        <span className="summary-value">{totals.totalGrossWeight.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <label>Total Net Weight:</label>
                        <span className="summary-value">{totals.totalNetWeight.toFixed(2)}</span>
                    </div>
                </div>

                {errors.bags && <div className="error-text form-error">{errors.bags}</div>}
                {errors.submit && <div className="error-text form-error">{errors.submit}</div>}

                {/* Action Buttons */}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Generate Bill
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleSaveAndGenerate}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save & Generate'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setFormData({
                                dcNumber: '',
                                date: new Date().toISOString().split('T')[0],
                                customerName: '',
                                quality: '',
                                vehicleNumber: '',
                                driverName: ''
                            });
                            setBags(generateInitialBags());
                            setErrors({});
                        }}
                    >
                        Clear Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeliveryForm;
