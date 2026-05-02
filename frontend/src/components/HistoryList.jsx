import React, { useState, useEffect } from 'react';
import { getAllDeliveryNotes } from '../services/api';
import { formatDate } from '../utils/calculations';
import DeliveryBill from './DeliveryBill';

const HistoryList = ({ onViewBill }) => {
    const [deliveryNotes, setDeliveryNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        fetchDeliveryNotes();
    }, []);

    const fetchDeliveryNotes = async () => {
        try {
            setLoading(true);
            const response = await getAllDeliveryNotes();
            setDeliveryNotes(response.data || []);
            setError('');
        } catch (err) {
            setError('Failed to load delivery notes. Please try again.');
            console.error('Error fetching delivery notes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewBill = (note) => {
        setSelectedNote(note);
    };

    const handleBackToList = () => {
        setSelectedNote(null);
    };

    if (selectedNote) {
        return (
            <div className="history-bill-view">
                <button className="btn btn-secondary" onClick={handleBackToList}>
                    ← Back to History
                </button>
                <DeliveryBill
                    formData={{
                        dcNumber: selectedNote.dcNumber,
                        date: selectedNote.date,
                        customerName: selectedNote.customerName,
                        quality: selectedNote.quality,
                        vehicleNumber: selectedNote.vehicleNumber,
                        driverName: selectedNote.driverName
                    }}
                    bags={selectedNote.bags.map((bag, index) => ({
                        serialNumber: index + 1,
                        ...bag
                    }))}
                    totals={{
                        totalGrossWeight: selectedNote.totalGrossWeight,
                        totalNetWeight: selectedNote.totalNetWeight,
                        totalBags: selectedNote.totalBags
                    }}
                />
            </div>
        );
    }

    if (loading) {
        return <div className="loading">Loading delivery notes...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="history-list">
            <h2>Delivery Note History</h2>

            {deliveryNotes.length === 0 ? (
                <div className="no-records">
                    <p>No delivery notes found. Create your first delivery note!</p>
                </div>
            ) : (
                <div className="history-table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>DC Number</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Quality</th>
                                <th>Total Bags</th>
                                <th>Total Net WT</th>
                                <th>Vehicle No</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryNotes.map((note) => (
                                <tr key={note._id}>
                                    <td>{note.dcNumber}</td>
                                    <td>{formatDate(note.date)}</td>
                                    <td>{note.customerName}</td>
                                    <td>{note.quality}</td>
                                    <td>{note.totalBags}</td>
                                    <td>{note.totalNetWeight.toFixed(2)}</td>
                                    <td>{note.vehicleNumber}</td>
                                    <td>
                                        <button
                                            className="btn btn-small btn-primary"
                                            onClick={() => handleViewBill(note)}
                                        >
                                            View Bill
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default HistoryList;
