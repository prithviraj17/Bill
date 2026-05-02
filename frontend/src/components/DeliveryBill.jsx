import React from 'react';
import { formatDate } from '../utils/calculations';

const DeliveryBill = ({ formData, bags, totals }) => {
    // Filter valid bags
    const validBags = bags.filter(bag =>
        bag.bagNumber || bag.grossWeight || bag.netWeight
    );

    // Split bags into two columns (1-15 and 16-30)
    const leftColumn = validBags.slice(0, 15);
    const rightColumn = validBags.slice(15, 30);
    const maxRows = Math.max(leftColumn.length, rightColumn.length, 1);

    // Pad shorter column with empty entries
    const paddedLeft = [...leftColumn, ...Array(Math.max(0, maxRows - leftColumn.length)).fill(null)];
    const paddedRight = [...rightColumn, ...Array(Math.max(0, maxRows - rightColumn.length)).fill(null)];

    return (
        <div id="delivery-bill" className="delivery-bill">
            {/* Bill Header */}
            <div className="bill-header">
                <h1 className="company-name">RK TOP YARN</h1>
                <h2 className="bill-title">DELIVERY NOTE</h2>
            </div>

            {/* Header Information */}
            <div className="bill-info">
                <div className="info-row">
                    <div className="info-item">
                        <span className="info-label">DC No:</span>
                        <span className="info-value">{formData.dcNumber}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Date:</span>
                        <span className="info-value">{formatDate(formData.date)}</span>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-item">
                        <span className="info-label">M/S:</span>
                        <span className="info-value">{formData.customerName}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Quality:</span>
                        <span className="info-value">{formData.quality}</span>
                    </div>
                </div>
            </div>

            {/* Two-Column Bag Table */}
            <div className="bill-table-container">
                <table className="bill-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Bag No</th>
                            <th>G.WT</th>
                            <th>NET WT</th>
                            <th>S.No</th>
                            <th>Bag No</th>
                            <th>G.WT</th>
                            <th>NET WT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: maxRows }, (_, rowIndex) => {
                            const leftBag = paddedLeft[rowIndex];
                            const rightBag = paddedRight[rowIndex];

                            return (
                                <tr key={rowIndex}>
                                    <td>{leftBag ? leftBag.serialNumber : ''}</td>
                                    <td>{leftBag ? leftBag.bagNumber : ''}</td>
                                    <td>{leftBag ? leftBag.grossWeight : ''}</td>
                                    <td>{leftBag ? leftBag.netWeight : ''}</td>
                                    <td>{rightBag ? rightBag.serialNumber : ''}</td>
                                    <td>{rightBag ? rightBag.bagNumber : ''}</td>
                                    <td>{rightBag ? rightBag.grossWeight : ''}</td>
                                    <td>{rightBag ? rightBag.netWeight : ''}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer Section */}
            <div className="bill-footer">
                <div className="footer-section totals-section">
                    <div className="total-row">
                        <span className="total-label">Total Bags:</span>
                        <span className="total-value">{totals.totalBags}</span>
                    </div>
                    <div className="total-row">
                        <span className="total-label">Total G.WT:</span>
                        <span className="total-value">{totals.totalGrossWeight.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                        <span className="total-label">Total NET WT:</span>
                        <span className="total-value">{totals.totalNetWeight.toFixed(2)}</span>
                    </div>
                </div>

                <div className="footer-section vehicle-section">
                    <div className="vehicle-info">
                        <span className="info-label">Vehicle No:</span>
                        <span className="info-value">{formData.vehicleNumber}</span>
                    </div>
                    <div className="driver-info">
                        <span className="info-label">Driver:</span>
                        <span className="info-value">{formData.driverName}</span>
                    </div>
                </div>

                <div className="footer-section signature-section">
                    <p className="signature-text">Signature of Receiver</p>
                    <div className="signature-line"></div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryBill;
