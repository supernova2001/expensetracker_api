const User = require('../Models/User.js');

async function registerUser(req, res) {
    const { firstname, lastname, email, username, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new user
        const newUser = new User({
            firstname,
            lastname,
            email,
            username,
            password, // Assuming password hashing is handled in the User model (e.g., with pre-save hooks)
        });

        // Save the user in the database
        await newUser.save();

        // Send success response
        res.status(200).json({ message: 'User registered successfully', user: { email: newUser.email } });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = registerUser;