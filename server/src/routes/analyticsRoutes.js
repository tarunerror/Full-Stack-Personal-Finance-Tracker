const express = require('express');
const router = express.Router();
const { getMonthlyAnalytics, getCategoryAnalytics, getSummaryAnalytics } = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Financial analytics
 */

/**
 * @swagger
 * /analytics/monthly:
 *   get:
 *     summary: Get monthly income/expense data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly data
 */
router.get('/monthly', verifyToken, getMonthlyAnalytics);

/**
 * @swagger
 * /analytics/category:
 *   get:
 *     summary: Get expense breakdown by category
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category data
 */
router.get('/category', verifyToken, getCategoryAnalytics);

/**
 * @swagger
 * /analytics/summary:
 *   get:
 *     summary: Get total balance, income, and expense
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary data
 */
router.get('/summary', verifyToken, getSummaryAnalytics);

module.exports = router;
