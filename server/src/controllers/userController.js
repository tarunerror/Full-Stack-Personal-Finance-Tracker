const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            // Optional: Delete user's transactions first if not handled by DB cascade
            await Transaction.destroy({ where: { userId: user.id } });
            await user.destroy();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const { role } = req.body;
        if (!['admin', 'user', 'read-only'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        
        user.role = role;
        await user.save();
        
        res.json({ 
            id: user.id, 
            username: user.username, 
            email: user.email, 
            role: user.role 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    updateUserRole
};
