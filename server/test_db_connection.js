require('dotenv').config();
const { Client } = require('pg');

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

console.log('Attempting to connect with config:', {
    ...config,
    password: config.password ? '****' : 'NOT_SET'
});

const client = new Client(config);

async function testConnection() {
    try {
        await client.connect();
        console.log('Successfully connected to PostgreSQL!');
        const res = await client.query('SELECT NOW()');
        console.log('Database time:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection failed:', err.message);
        if (err.message.includes('password authentication failed')) {
            console.error('HINT: Double check your DB_PASSWORD. It must match the password for the user "' + config.user + '".');
        }
        await client.end();
    }
}

testConnection();
