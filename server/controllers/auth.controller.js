const User = require('../models/user.model');
const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/authHelper');

// Simple email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const googleSignIn = async (req, res) => {
    try {
        // Check if the request body contains necessary fields
        if (!req.body.email || !req.body.username || !req.body.avatar) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const userEmail = req.body.email.toLowerCase();

        // Check if user exists by primary email OR any verified secondary email
        let user = await User.findOne({
            $or: [
                { email: userEmail },
                { 'secondaryEmails.email': userEmail, 'secondaryEmails.verified': true }
            ]
        });
        
        let isNewUser = false;

        if (!user) {
            // If user doesn't exist, generate a random password and create a new user
            const generatePassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await hashPassword(generatePassword);

            // Create a new user instance
            user = new User({
                username: req.body.username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), // Add random chars to avoid conflicts
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar,
                secondaryEmails: [] // Initialize empty secondary emails array
            });

            // Save the new user
            await user.save();
            isNewUser = true;
        } else {
            // User exists - check if the login email is a secondary email
            const isSecondaryEmail = user.secondaryEmails.some(
                sec => sec.email === userEmail && sec.verified === true
            );
            
            // If logging in with a secondary email, we need to return the main user account
            // No need to create new user, just proceed with login
            console.log(`User found: ${user.email}, Login email: ${userEmail}, Is secondary: ${isSecondaryEmail}`);
        }

        // Generate JWT token
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);

        // Remove sensitive data from the user object
        const { password: pass, ...rest } = user._doc;

        // Include token in the user object
        const userWithToken = { ...rest, token };

        // Send response
        if (isNewUser) {
            return res.status(200).json({ user: userWithToken, message: "New user created successfully!" });
        } else {
            return res.status(200).json({ user: userWithToken, message: "Login Successful!" });
        }
    } catch (error) {
        if (error.code === 11000) {
            // If username conflict, try with a different username
            if (error.keyPattern.username) {
                try {
                    const generatePassword = Math.random().toString(36).slice(-8);
                    const hashedPassword = await hashPassword(generatePassword);
                    
                    const user = new User({
                        username: req.body.username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-6),
                        email: req.body.email,
                        password: hashedPassword,
                        avatar: req.body.avatar,
                        secondaryEmails: []
                    });
                    
                    await user.save();
                    
                    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);
                    const { password: pass, ...rest } = user._doc;
                    const userWithToken = { ...rest, token };
                    
                    return res.status(200).json({ user: userWithToken, message: "New user created successfully!" });
                } catch (retryError) {
                    console.error('Retry error:', retryError);
                }
            }
            return res.status(400).json({ 
                message: "Username or email already exists. Please choose another." 
            });
        }
        console.error('Google signin error:', error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
}

// Regular login that works with primary or secondary emails
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Find user by primary email or any verified secondary email
        const user = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { 'secondaryEmails.email': normalizedEmail, 'secondaryEmails.verified': true }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);

        // Remove sensitive data
        const { password: pass, ...userWithoutPassword } = user._doc;

        // Include token in response
        const userWithToken = { ...userWithoutPassword, token };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userWithToken
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Debug endpoint to check user emails
const debugUserEmails = async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email parameter is required'
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Find all users that have this email as primary or secondary
        const users = await User.find({
            $or: [
                { email: normalizedEmail },
                { 'secondaryEmails.email': normalizedEmail }
            ]
        }).select('email secondaryEmails username');

        res.status(200).json({
            success: true,
            data: {
                searchEmail: normalizedEmail,
                foundUsers: users
            }
        });

    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            success: false,
            message: 'Debug failed'
        });
    }
};

// Add secondary email
const addSecondaryEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user.id;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Check if email already exists as primary or secondary for any user
        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { 'secondaryEmails.email': normalizedEmail }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'This email is already associated with another account'
            });
        }

        // Get current user
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is trying to add their own primary email
        if (currentUser.email === normalizedEmail) {
            return res.status(400).json({
                success: false,
                message: 'This is already your primary email'
            });
        }

        // Check if email already exists in user's secondary emails
        const emailExists = currentUser.secondaryEmails.some(
            secEmail => secEmail.email === normalizedEmail
        );

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'This email is already added to your account'
            });
        }

        // Add secondary email (unverified initially)
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {
                $push: {
                    secondaryEmails: {
                        email: normalizedEmail,
                        verified: false,
                        addedAt: new Date()
                    }
                }
            },
            { new: true }
        ).select('email secondaryEmails');

        console.log('Added secondary email:', {
            userId,
            primaryEmail: updatedUser.email,
            secondaryEmails: updatedUser.secondaryEmails
        });

        res.status(200).json({
            success: true,
            message: 'Secondary email added successfully. Verification required before login.',
            data: {
                primaryEmail: updatedUser.email,
                secondaryEmails: updatedUser.secondaryEmails
            }
        });

    } catch (error) {
        console.error('Add secondary email error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const verifySecondaryEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user.id;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const normalizedEmail = email.toLowerCase();

        const result = await User.updateOne(
            { 
                _id: userId, 
                'secondaryEmails.email': normalizedEmail 
            },
            { 
                $set: { 
                    'secondaryEmails.$.verified': true,
                    'secondaryEmails.$.verifiedAt': new Date()
                } 
            }
        );

        console.log('Email verification result:', {
            userId,
            email: normalizedEmail,
            modifiedCount: result.modifiedCount
        });

        if (result.modifiedCount === 0) {
            // Check why it failed
            const user = await User.findById(userId);
            const secondaryEmail = user.secondaryEmails.find(sec => sec.email === normalizedEmail);
            
            return res.status(400).json({
                success: false,
                message: secondaryEmail ? 
                    'Email is already verified' : 
                    'Email not found in your secondary emails'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now use this email to login.'
        });

    } catch (error) {
        console.error('Verify secondary email error:', error);
        res.status(500).json({
            success: false,
            message: 'Email verification failed'
        });
    }
};

const removeSecondaryEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user.id;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        await User.findByIdAndUpdate(userId, {
            $pull: {
                secondaryEmails: { email: email.toLowerCase() }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Secondary email removed successfully'
        });

    } catch (error) {
        console.error('Remove secondary email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove secondary email'
        });
    }
};

const getUserEmails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('email secondaryEmails');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                primaryEmail: user.email,
                secondaryEmails: user.secondaryEmails
            }
        });

    } catch (error) {
        console.error('Get user emails error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = { 
    googleSignIn,
    login,
    addSecondaryEmail,
    verifySecondaryEmail,
    removeSecondaryEmail,
    getUserEmails,
    debugUserEmails
};