const Transaction = require('../models/Transaction');
const { sequelize } = require('../config/db');
const { redisClient } = require('../config/redis');
const { Op } = require('sequelize');

// Helper to get cache key
const getCacheKey = (userId, type) => `analytics:${userId}:${type}`;

// @desc    Get monthly income vs expense
// @route   GET /api/analytics/monthly
// @access  Private
const getMonthlyAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = getCacheKey(userId, 'monthly');

        // Check Cache
        if (redisClient.isOpen) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        }

        // Calculate Monthly Data (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const transactions = await Transaction.findAll({
            where: {
                userId,
                date: { [Op.gte]: sixMonthsAgo }
            },
            attributes: [
                [sequelize.fn('to_char', sequelize.col('date'), 'Mon'), 'month'],
                'type',
                [sequelize.fn('sum', sequelize.col('amount')), 'total']
            ],
            group: ['month', 'type', sequelize.fn('to_char', sequelize.col('date'), 'Mon')],
            order: [[sequelize.fn('to_char', sequelize.col('date'), 'Mon'), 'DESC']]
        });

        // Process data for frontend
        const processedData = [];
        const monthMap = new Map();

        transactions.forEach(t => {
            const month = t.getDataValue('month');
            const type = t.type;
            const total = parseFloat(t.getDataValue('total'));

            if (!monthMap.has(month)) {
                monthMap.set(month, { name: month, income: 0, expense: 0 });
            }
            const entry = monthMap.get(month);
            if (type === 'income') entry.income = total;
            if (type === 'expense') entry.expense = total;
        });

        const result = Array.from(monthMap.values()).reverse();

        // Set Cache (15 minutes)
        if (redisClient.isOpen) {
            await redisClient.setEx(cacheKey, 900, JSON.stringify(result));
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get category breakdown
// @route   GET /api/analytics/category
// @access  Private
const getCategoryAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = getCacheKey(userId, 'category');

        if (redisClient.isOpen) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        }

        const categories = await Transaction.findAll({
            where: { userId, type: 'expense' },
            attributes: [
                'category',
                [sequelize.fn('sum', sequelize.col('amount')), 'value']
            ],
            group: ['category']
        });

        const result = categories.map(c => ({
            name: c.category,
            value: parseFloat(c.getDataValue('value'))
        }));

        if (redisClient.isOpen) {
            await redisClient.setEx(cacheKey, 900, JSON.stringify(result)); 
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get total balance, income, expense
// @route   GET /api/analytics/summary
// @access  Private
const getSummaryAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = `summary:${userId}`;

        if (redisClient.isOpen) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        }

        const totals = await Transaction.findAll({
            where: { userId },
            attributes: [
                'type',
                [sequelize.fn('sum', sequelize.col('amount')), 'total']
            ],
            group: ['type']
        });

        let income = 0;
        let expense = 0;

        totals.forEach(t => {
            const type = t.type;
            const total = parseFloat(t.getDataValue('total'));
            if (type === 'income') income = total;
            if (type === 'expense') expense = total;
        });

        const summary = {
            income,
            expense,
            balance: income - expense
        };

        if (redisClient.isOpen) {
            await redisClient.setEx(cacheKey, 900, JSON.stringify(summary));
        }

        res.json(summary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMonthlyAnalytics,
    getCategoryAnalytics,
    getSummaryAnalytics
};
