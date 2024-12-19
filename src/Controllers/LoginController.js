const User = require('../Models/User.js');

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { firstname, lastname, username } = user;
        // Send success response
        res.status(200).json({ message: 'Login successful', user: {
            firstname,
            lastname,
            email,
            username,
        } });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = loginUser;