// Calculate totals from bag entries
export const calculateTotals = (bags) => {
    // Filter out completely empty bags
    const validBags = bags.filter(bag =>
        bag.bagNumber || bag.grossWeight || bag.netWeight
    );

    // Calculate totals
    const totalGrossWeight = validBags.reduce((sum, bag) => {
        const weight = parseFloat(bag.grossWeight) || 0;
        return sum + weight;
    }, 0);

    const totalNetWeight = validBags.reduce((sum, bag) => {
        const weight = parseFloat(bag.netWeight) || 0;
        return sum + weight;
    }, 0);

    const totalBags = validBags.length;

    return {
        totalGrossWeight: parseFloat(totalGrossWeight.toFixed(2)),
        totalNetWeight: parseFloat(totalNetWeight.toFixed(2)),
        totalBags
    };
};

// Generate initial bag array with 30 empty entries
export const generateInitialBags = () => {
    return Array.from({ length: 30 }, (_, index) => ({
        serialNumber: index + 1,
        bagNumber: '',
        grossWeight: '',
        netWeight: ''
    }));
};

// Validate form data
export const validateFormData = (formData, bags) => {
    const errors = {};

    // Validate required fields
    if (!formData.dcNumber.trim()) {
        errors.dcNumber = 'DC Number is required';
    }

    if (!formData.date) {
        errors.date = 'Date is required';
    }

    if (!formData.customerName.trim()) {
        errors.customerName = 'Customer Name is required';
    }

    if (!formData.quality.trim()) {
        errors.quality = 'Quality is required';
    }

    if (!formData.vehicleNumber.trim()) {
        errors.vehicleNumber = 'Vehicle Number is required';
    }

    if (!formData.driverName.trim()) {
        errors.driverName = 'Driver Name is required';
    }

    // Validate at least one bag entry
    const validBags = bags.filter(bag =>
        bag.bagNumber || bag.grossWeight || bag.netWeight
    );

    if (validBags.length === 0) {
        errors.bags = 'At least one bag entry is required';
    }

    // Validate bag weights are positive numbers
    bags.forEach((bag, index) => {
        if (bag.grossWeight && (isNaN(bag.grossWeight) || parseFloat(bag.grossWeight) < 0)) {
            errors[`bag_${index}_gross`] = 'Invalid gross weight';
        }
        if (bag.netWeight && (isNaN(bag.netWeight) || parseFloat(bag.netWeight) < 0)) {
            errors[`bag_${index}_net`] = 'Invalid net weight';
        }
    });

    return errors;
};

// Format date for display
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
