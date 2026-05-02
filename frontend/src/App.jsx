import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveData } from './services/api';

function App() {
    const [form, setForm] = useState({
        dcNo: "",
        date: new Date().toISOString().split('T')[0],
        customer: "",
        quality: "",
        vehicleNo: "",
        driverName: "",
        bags: Array.from({ length: 30 }, () => ({
            bagNo: "",
            gross: "",
            net: "",
        })),
    });

    const [showBill, setShowBill] = useState(false);
    const [billSerialNumber, setBillSerialNumber] = useState(() => {
        // Load last used serial number from localStorage
        const lastNumber = localStorage.getItem('billSerialNumber');
        return lastNumber ? parseInt(lastNumber) : 1000;
    });

    // Handle top inputs
    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    // Handle bag inputs
    const handleBagChange = (index, field, value) => {
        const updated = [...form.bags];
        updated[index][field] = value;

        // Auto-calculate net weight: bag number × gross weight
        if (field === 'gross' || field === 'bagNo') {
            const bagNo = Number(updated[index].bagNo) || 0;
            const gross = Number(updated[index].gross) || 0;
            updated[index].net = (bagNo * gross).toFixed(2);
        }

        setForm({ ...form, bags: updated });
    };

    // Calculations
    const totalGross = form.bags.reduce(
        (sum, b) => sum + Number(b.gross || 0),
        0
    );

    const totalNet = form.bags.reduce(
        (sum, b) => sum + Number(b.net || 0),
        0
    );

    const totalBags = form.bags.filter((b) => b.bagNo || b.gross || b.net).length;

    // PDF Download
    const downloadPDF = async () => {
        const input = document.getElementById("bill");
        if (!input) return;

        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`delivery-note-${form.dcNo || 'export'}.pdf`);
    };

    // Handle Generate Bill
    const handleGenerateBill = (e) => {
        e.preventDefault();
        setShowBill(true);
        // Increment serial number and save to localStorage
        const newSerialNumber = billSerialNumber + 1;
        setBillSerialNumber(newSerialNumber);
        localStorage.setItem('billSerialNumber', newSerialNumber.toString());
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    // Handle Save to PostgreSQL
    const handleSave = async () => {
        try {
            const formData = {
                dcNo: form.dcNo,
                date: form.date,
                customer: form.customer,
                quality: form.quality,
                vehicleNo: form.vehicleNo,
                driverName: form.driverName,
                totalGross: totalGross,
                totalNet: totalNet,
                totalBags: totalBags,
                bags: form.bags.filter(b => b.bagNo || b.gross || b.net),
            };

            await saveData(formData);
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    // Handle Reset Form
    const handleReset = () => {
        setForm({
            dcNo: "",
            date: new Date().toISOString().split('T')[0],
            customer: "",
            quality: "",
            vehicleNo: "",
            driverName: "",
            bags: Array.from({ length: 30 }, () => ({
                bagNo: "",
                gross: "",
                net: "",
            })),
        });
        setShowBill(false);
    };

    // Split bags for two-column layout
    const validBags = form.bags.filter((b) => b.bagNo || b.gross || b.net);
    const leftColumn = validBags.slice(0, 15);
    const rightColumn = validBags.slice(15, 30);
    const maxRows = Math.max(leftColumn.length, rightColumn.length, 1);

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>RK TOP YARN</h1>
                <p style={styles.headerTagline}>The thread that binds us</p>
                <p style={styles.headerAddress}>
                    Muthumariamman Temple, 5/293-A, Sri Selva Vinayagar Nagar,
                </p>
                <p style={styles.headerGSTIN}>
                    <strong>GSTIN :</strong> 33LJFPK4928J1ZT
                </p>
                <p style={styles.headerContact}>
                    <strong>Contact:</strong> +91 8807776001, +91 7904757176
                </p>
                <p style={styles.headerEmail}>
                    <strong>mail to :</strong> rktopyarn@gmail.com
                </p>
                <p style={styles.headerSubtitle}>Delivery Note Management System</p>
            </div>

            {/* NAVIGATION */}
            <div style={styles.navContainer}>
                <button
                    style={styles.navButton}
                    onClick={() => setShowBill(false)}
                >
                    📝 New Delivery Note
                </button>
                <button
                    style={{ ...styles.navButton, opacity: 0.5, cursor: 'not-allowed' }}
                    disabled
                >
                    📋 View History
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div style={styles.mainContent}>
                {!showBill ? (
                    <div style={styles.formCard}>
                        <h2 style={styles.formTitle}>📝 Create Delivery Note</h2>

                        {/* FORM FIELDS */}
                        <form onSubmit={handleGenerateBill}>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>DC Number *</label>
                                    <input
                                        style={styles.input}
                                        placeholder="Enter DC Number"
                                        value={form.dcNo}
                                        onChange={(e) => handleChange("dcNo", e.target.value)}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Date *</label>
                                    <input
                                        type="date"
                                        style={styles.input}
                                        value={form.date}
                                        onChange={(e) => handleChange("date", e.target.value)}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Customer Name (M/S) *</label>
                                    <input
                                        style={styles.input}
                                        placeholder="Enter Customer Name"
                                        value={form.customer}
                                        onChange={(e) => handleChange("customer", e.target.value)}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Quality *</label>
                                    <input
                                        style={styles.input}
                                        placeholder="Enter Quality"
                                        value={form.quality}
                                        onChange={(e) => handleChange("quality", e.target.value)}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Vehicle Number *</label>
                                    <input
                                        style={styles.input}
                                        placeholder="Enter Vehicle Number"
                                        value={form.vehicleNo}
                                        onChange={(e) => handleChange("vehicleNo", e.target.value)}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Driver Name *</label>
                                    <input
                                        style={styles.input}
                                        placeholder="Enter Driver Name"
                                        value={form.driverName}
                                        onChange={(e) => handleChange("driverName", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* BAG TABLE */}
                            <div style={styles.bagTableContainer}>
                                <h3 style={styles.bagTableTitle}>📦 Bag Details (Up to 30 bags)</h3>
                                <div style={styles.tableWrapper}>
                                    <table style={styles.bagTable}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>S.No</th>
                                                <th style={styles.th}>Bag Number</th>
                                                <th style={styles.th}>Gross Weight (G.WT)</th>
                                                <th style={styles.th}>Net Weight (NET WT)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {form.bags.map((b, i) => (
                                                <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                                                    <td style={styles.serialNumber}>{i + 1}</td>
                                                    <td style={styles.td}>
                                                        <input
                                                            style={styles.tableInput}
                                                            placeholder="Bag No"
                                                            value={b.bagNo}
                                                            onChange={(e) =>
                                                                handleBagChange(i, "bagNo", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td style={styles.td}>
                                                        <input
                                                            style={styles.tableInput}
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0.00"
                                                            value={b.gross}
                                                            onChange={(e) =>
                                                                handleBagChange(i, "gross", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td style={styles.td}>
                                                        <input
                                                            style={styles.tableInput}
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0.00"
                                                            value={b.net}
                                                            onChange={(e) =>
                                                                handleBagChange(i, "net", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SUMMARY */}
                            <div style={styles.summaryContainer}>
                                <div style={styles.summaryItem}>
                                    <label style={styles.summaryLabel}>Total Bags:</label>
                                    <span style={styles.summaryValue}>{totalBags}</span>
                                </div>
                                <div style={styles.summaryItem}>
                                    <label style={styles.summaryLabel}>Total Gross Weight:</label>
                                    <span style={styles.summaryValue}>{totalGross.toFixed(2)}</span>
                                </div>
                                <div style={styles.summaryItem}>
                                    <label style={styles.summaryLabel}>Total Net Weight:</label>
                                    <span style={styles.summaryValue}>{totalNet.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.primaryButton}>
                                    Generate Bill
                                </button>
                                <button type="button" style={styles.successButton}>
                                    💾 Save & Generate
                                </button>
                                <button type="button" style={styles.secondaryButton} onClick={handleReset}>
                                    🔄 Clear Form
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div style={styles.billView}>
                        {/* BILL */}
                        <div id="bill" style={styles.bill}>
                            <div style={styles.billHeader}>
                                <h1 style={styles.companyName}>RK TOP YARN</h1>
                                <p style={styles.companyTagline}>The thread that binds us</p>
                                <p style={styles.companyAddress}>
                                    Muthumariamman Temple, 5/293-A, Sri Selva Vinayagar Nagar,
                                </p>
                                <p style={styles.companyGSTIN}>
                                    <strong>GSTIN :</strong> 33LJFPK4928J1ZT
                                </p>
                                <p style={styles.companyContact}>
                                    <strong>Contact:</strong> +91 8807776001, +91 7904757176
                                </p>
                                <p style={styles.companyEmail}>
                                    <strong>mail to :</strong> rktopyarn@gmail.com
                                </p>
                                <div style={styles.serialNumberContainer}>
                                    <span style={styles.serialNumberLabel}>Bill No:</span>
                                    <span style={styles.serialNumberValue}>{String(billSerialNumber).padStart(6, '0')}</span>
                                </div>
                                <h2 style={styles.billTitle}>DELIVERY NOTE</h2>
                            </div>

                            <div style={styles.billInfo}>
                                <div style={styles.infoRow}>
                                    <div style={styles.infoItem}>
                                        <span style={styles.infoLabel}>DC No:</span>
                                        <span style={styles.infoValue}>{form.dcNo}</span>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <span style={styles.infoLabel}>Date:</span>
                                        <span style={styles.infoValue}>{form.date}</span>
                                    </div>
                                </div>
                                <div style={styles.infoRow}>
                                    <div style={styles.infoItem}>
                                        <span style={styles.infoLabel}>M/S:</span>
                                        <span style={styles.infoValue}>{form.customer}</span>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <span style={styles.infoLabel}>Quality:</span>
                                        <span style={styles.infoValue}>{form.quality}</span>
                                    </div>
                                </div>
                            </div>

                            {/* TWO-COLUMN BILL TABLE */}
                            <div style={styles.billTableContainer}>
                                <table style={styles.billTable}>
                                    <thead>
                                        <tr>
                                            <th style={styles.billTh}>S.No</th>
                                            <th style={styles.billTh}>Bag No</th>
                                            <th style={styles.billTh}>G.WT</th>
                                            <th style={styles.billTh}>NET WT</th>
                                            <th style={styles.billTh}>S.No</th>
                                            <th style={styles.billTh}>Bag No</th>
                                            <th style={styles.billTh}>G.WT</th>
                                            <th style={styles.billTh}>NET WT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: maxRows }, (_, rowIndex) => {
                                            const leftBag = leftColumn[rowIndex];
                                            const rightBag = rightColumn[rowIndex];
                                            return (
                                                <tr key={rowIndex}>
                                                    <td style={styles.billTd}>{leftBag ? leftColumn.indexOf(leftBag) + 1 : ''}</td>
                                                    <td style={styles.billTd}>{leftBag?.bagNo || ''}</td>
                                                    <td style={styles.billTd}>{leftBag?.gross || ''}</td>
                                                    <td style={styles.billTd}>{leftBag?.net || ''}</td>
                                                    <td style={styles.billTd}>{rightBag ? rightColumn.indexOf(rightBag) + 16 : ''}</td>
                                                    <td style={styles.billTd}>{rightBag?.bagNo || ''}</td>
                                                    <td style={styles.billTd}>{rightBag?.gross || ''}</td>
                                                    <td style={styles.billTd}>{rightBag?.net || ''}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* FOOTER */}
                            <div style={styles.billFooter}>
                                <div style={styles.footerSection}>
                                    <div style={styles.totalRow}>
                                        <span style={styles.totalLabel}>Total Bags:</span>
                                        <span style={styles.totalValue}>{totalBags}</span>
                                    </div>
                                    <div style={styles.totalRow}>
                                        <span style={styles.totalLabel}>Total G.WT:</span>
                                        <span style={styles.totalValue}>{totalGross.toFixed(2)}</span>
                                    </div>
                                    <div style={styles.totalRow}>
                                        <span style={styles.totalLabel}>Total NET WT:</span>
                                        <span style={styles.totalValue}>{totalNet.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div style={styles.footerSection}>
                                    <div style={styles.vehicleInfo}>
                                        <span style={styles.infoLabel}>Vehicle No:</span>
                                        <span style={styles.infoValue}>{form.vehicleNo}</span>
                                    </div>
                                    <div style={styles.driverInfo}>
                                        <span style={styles.infoLabel}>Driver:</span>
                                        <span style={styles.infoValue}>{form.driverName}</span>
                                    </div>
                                </div>

                                <div style={styles.signatureSection}>
                                    <p style={styles.signatureText}>Signature of Receiver</p>
                                    <div style={styles.signatureLine}></div>
                                </div>
                            </div>
                        </div>

                        {/* BILL ACTIONS */}
                        <div style={styles.billActions}>
                            <button style={styles.successButton} onClick={handleSave}>
                                💾 Save to Database
                            </button>
                            <button style={styles.primaryButton} onClick={() => window.print()}>
                                🖨️ Print Bill
                            </button>
                            <button style={styles.successButton} onClick={downloadPDF}>
                                📄 Download PDF
                            </button>
                            <button style={styles.secondaryButton} onClick={() => setShowBill(false)}>
                                ← Create New
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div style={styles.footer}>
                <p>© 2026 RK TOP YARN. All rights reserved.</p>
            </div>
        </div>
    );
}

// STYLES
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
        textAlign: 'center',
        padding: '50px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden',
    },
    headerTitle: {
        fontSize: '3.5rem',
        fontWeight: '900',
        margin: '0 0 12px 0',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
    },
    headerTagline: {
        fontSize: '1.2rem',
        fontStyle: 'italic',
        margin: '0 0 10px 0',
        opacity: 0.95,
        letterSpacing: '1px',
        fontWeight: '500',
    },
    headerAddress: {
        fontSize: '1rem',
        margin: '0 0 8px 0',
        opacity: 0.9,
        lineHeight: '1.5',
    },
    headerGSTIN: {
        fontSize: '0.95rem',
        margin: '0 0 6px 0',
        opacity: 0.9,
    },
    headerContact: {
        fontSize: '0.95rem',
        margin: '0 0 6px 0',
        opacity: 0.9,
    },
    headerEmail: {
        fontSize: '0.95rem',
        margin: '0 0 12px 0',
        opacity: 0.9,
    },
    headerSubtitle: {
        fontSize: '1.3rem',
        fontWeight: '300',
        margin: 0,
        opacity: 0.95,
        letterSpacing: '2px',
    },
    navContainer: {
        display: 'flex',
        gap: '15px',
        margin: '30px auto',
        justifyContent: 'center',
        maxWidth: '600px',
        padding: '0 20px',
    },
    navButton: {
        padding: '16px 40px',
        fontSize: '1.1rem',
        fontWeight: '700',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        background: 'rgba(255, 255, 255, 0.15)',
        color: '#ffffff',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    mainContent: {
        background: 'transparent',
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
    },
    formCard: {
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        padding: '45px',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    },
    formTitle: {
        fontSize: '2.2rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '35px',
        paddingBottom: '18px',
        borderBottom: '4px solid #667eea',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontWeight: '600',
        marginBottom: '10px',
        color: '#1f2937',
        fontSize: '0.95rem',
    },
    input: {
        padding: '14px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '10px',
        fontSize: '1rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: '#fafbfc',
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    bagTableContainer: {
        margin: '45px 0',
        background: 'linear-gradient(to bottom, #ffffff, #fafbfc)',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
        border: '2px solid #e5e7eb',
    },
    bagTableTitle: {
        fontSize: '1.6rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '3px solid #667eea',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    bagTable: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '14px 12px',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.95rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: '1px solid #667eea',
    },
    trEven: {
        background: '#ffffff',
    },
    trOdd: {
        background: '#f9fafb',
    },
    serialNumber: {
        fontWeight: '700',
        color: '#667eea',
        textAlign: 'center',
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
    },
    td: {
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
    },
    tableInput: {
        width: '100%',
        padding: '10px 12px',
        border: '2px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '0.9rem',
        background: '#fafbfc',
    },
    summaryContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '35px',
        borderRadius: '16px',
        margin: '35px 0',
        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.35)',
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '18px 24px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    summaryLabel: {
        fontWeight: '700',
        color: '#ffffff',
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    summaryValue: {
        fontSize: '2rem',
        fontWeight: '800',
        color: '#ffffff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    },
    buttonGroup: {
        display: 'flex',
        gap: '20px',
        marginTop: '30px',
        flexWrap: 'wrap',
    },
    primaryButton: {
        padding: '14px 28px',
        fontSize: '1rem',
        fontWeight: '700',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    successButton: {
        padding: '14px 28px',
        fontSize: '1rem',
        fontWeight: '700',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    secondaryButton: {
        padding: '14px 28px',
        fontSize: '1rem',
        fontWeight: '700',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    billView: {
        maxWidth: '1200px',
        margin: '0 auto',
        animation: 'fadeIn 0.4s ease-in',
    },
    bill: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '50px',
        background: '#ffffff',
        border: '3px solid #667eea',
        borderRadius: '12px',
        boxShadow: '0 15px 50px rgba(102, 126, 234, 0.2)',
        position: 'relative',
    },
    billHeader: {
        textAlign: 'center',
        borderBottom: '3px solid #000000',
        paddingBottom: '20px',
        marginBottom: '25px',
    },
    companyName: {
        fontSize: '2.8rem',
        fontWeight: '900',
        margin: '0 0 8px 0',
        letterSpacing: '3px',
        color: '#000000',
        textTransform: 'uppercase',
    },
    companyTagline: {
        fontSize: '1.1rem',
        fontStyle: 'italic',
        margin: '0 0 12px 0',
        color: '#667eea',
        fontWeight: '500',
        letterSpacing: '1px',
    },
    companyAddress: {
        fontSize: '0.95rem',
        margin: '0 0 8px 0',
        color: '#333333',
        lineHeight: '1.5',
    },
    companyGSTIN: {
        fontSize: '0.9rem',
        margin: '0 0 6px 0',
        color: '#333333',
    },
    companyContact: {
        fontSize: '0.9rem',
        margin: '0 0 6px 0',
        color: '#333333',
    },
    companyEmail: {
        fontSize: '0.9rem',
        margin: '0 0 15px 0',
        color: '#333333',
    },
    serialNumberContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        margin: '15px 0',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
    },
    serialNumberLabel: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    serialNumberValue: {
        fontSize: '1.8rem',
        fontWeight: '900',
        color: '#ffffff',
        fontFamily: "'Courier New', monospace",
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        letterSpacing: '3px',
    },
    billTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: 0,
        letterSpacing: '1px',
        color: '#000000',
    },
    billInfo: {
        marginBottom: '25px',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e7eb',
    },
    infoItem: {
        display: 'flex',
        gap: '10px',
        flex: 1,
    },
    infoLabel: {
        fontWeight: '700',
        color: '#000000',
        minWidth: '100px',
    },
    infoValue: {
        color: '#333333',
        fontWeight: '500',
    },
    billTableContainer: {
        margin: '25px 0',
    },
    billTable: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '11px',
    },
    billTh: {
        border: '1px solid #000000',
        padding: '8px',
        textAlign: 'center',
        fontWeight: '700',
        background: '#f0f0f0',
        fontSize: '10px',
    },
    billTd: {
        border: '1px solid #000000',
        padding: '6px 8px',
        textAlign: 'center',
    },
    billFooter: {
        marginTop: '25px',
        paddingTop: '20px',
        borderTop: '3px solid #000000',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '30px',
        flexWrap: 'wrap',
    },
    footerSection: {
        flex: 1,
        minWidth: '200px',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '1rem',
    },
    totalLabel: {
        fontWeight: '700',
        color: '#000000',
    },
    totalValue: {
        fontWeight: '700',
        color: '#667eea',
        fontSize: '1.1rem',
    },
    vehicleInfo: {
        marginBottom: '12px',
    },
    driverInfo: {
        marginBottom: '12px',
    },
    signatureSection: {
        textAlign: 'center',
    },
    signatureText: {
        fontWeight: '600',
        marginBottom: '40px',
        color: '#000000',
    },
    signatureLine: {
        borderTop: '2px solid #000000',
        width: '100%',
        maxWidth: '200px',
        margin: '0 auto',
    },
    billActions: {
        display: 'flex',
        gap: '20px',
        marginTop: '45px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '35px',
        background: 'linear-gradient(to bottom, #ffffff, #fafbfc)',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
        border: '2px solid #e5e7eb',
    },
    footer: {
        textAlign: 'center',
        padding: '30px',
        marginTop: '50px',
        color: '#6b7280',
        background: '#ffffff',
        borderTop: '2px solid #e5e7eb',
    },
};

export default App;