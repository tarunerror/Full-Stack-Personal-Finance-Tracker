const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, sequelize } = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { xssProtection } = require('./src/middleware/authMiddleware');
const swaggerSetup = require('./swagger');

const app = express();
swaggerSetup(app);
const PORT = process.env.PORT || 5000;

const authRoutes = require('./src/routes/authRoutes');

const rateLimit = require('express-rate-limit');

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(xssProtection);
app.use(limiter);

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');

// Endpoint-specific rate limiting
app.use('/api/auth', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many auth attempts, please try again later'
}));

app.use('/api/transactions', rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100,
    message: 'Too many transaction requests, please try again later'
}));

app.use('/api/analytics', rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50,
    message: 'Too many analytics requests, please try again later'
}));

// Routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', require('./src/routes/transactionRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/admin', adminRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Personal Finance Tracker API is running');
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        try {
            await connectRedis();
        } catch (redisErr) {
            console.error('Redis connection failed, continuing without caching:', redisErr.message);
        }

        // Sync Database (force: false to avoid dropping tables)
        await sequelize.sync({ force: false });
        console.log('Database Synced');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();
