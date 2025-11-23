const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        const uniqueId = Date.now();
        const username = `testuser_${uniqueId}`;
        const email = `test_${uniqueId}@example.com`;
        const password = 'password123';

        // 1. Register User
        console.log('Testing Register...');
        const registerRes = await axios.post(`${API_URL}/register`, {
            username,
            email,
            password,
            role: 'user'
        });
        console.log('Register Success:', registerRes.data);
        const token = registerRes.data.token;

        // 2. Login User
        console.log('\nTesting Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        console.log('Login Success:', loginRes.data);

        // 3. Get Me
        console.log('\nTesting Get Me...');
        const meRes = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get Me Success:', meRes.data);

    } catch (error) {
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Response Status:', error.response.status);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
        console.error('Error Config:', error.config);
    }
};

testAuth();
