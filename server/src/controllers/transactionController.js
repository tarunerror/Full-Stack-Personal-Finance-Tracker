const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

// @desc    Add new transaction
// @route   POST /api/transactions
// @access  Private (Admin/User)
const addTransaction = async (req, res) => {
    const { amount, type, category, description, date } = req.body;

    try {
        const transaction = await Transaction.create({
            userId: req.user.id,
            amount,
            type,
            category,
            description,
            date,
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const whereClause = {};

        // If not admin, restrict to own transactions
        if (req.user.role !== 'admin') {
            whereClause.userId = req.user.id;
        } else if (req.query.userId) {
            // If admin, allow filtering by specific userId
            whereClause.userId = req.query.userId;
        }

        // Search/Filter
        if (req.query.search) {
            whereClause.description = { [Op.iLike]: `%${req.query.search}%` };
        }
        if (req.query.category) {
            whereClause.category = req.query.category;
        }
        if (req.query.type) {
            whereClause.type = req.query.type;
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Transaction.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['date', 'DESC']],
        });

        res.json({
            transactions: rows,
            page,
            pages: Math.ceil(count / limit),
            total: count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (transaction) {
            res.json(transaction);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private (Admin/User)
const updateTransaction = async (req, res) => {
    try {
        console.log('Updating transaction:', req.params.id, 'by user:', req.user.id, 'with role:', req.user.role);
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            console.log('Transaction not found');
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check ownership if not admin
        if (req.user.role !== 'admin' && transaction.userId !== req.user.id) {
            console.log('User not authorized to update transaction');
            return res.status(403).json({ message: 'Not authorized to update this transaction' });
        }

        const { amount, type, category, description, date } = req.body;
        console.log('Update data:', req.body);

        transaction.amount = amount || transaction.amount;
        transaction.type = type || transaction.type;
        transaction.category = category || transaction.category;
        transaction.description = description || transaction.description;
        transaction.date = date || transaction.date;

        const updatedTransaction = await transaction.save();
        console.log('Updated transaction:', updatedTransaction);
        res.json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private (Admin/User)
const deleteTransaction = async (req, res) => {
    try {
        const whereClause = { id: req.params.id };
        if (req.user.role !== 'admin') {
            whereClause.userId = req.user.id;
        }

        const transaction = await Transaction.findOne({ where: whereClause });

        if (transaction) {
            await transaction.destroy();
            res.json({ message: 'Transaction removed' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};
