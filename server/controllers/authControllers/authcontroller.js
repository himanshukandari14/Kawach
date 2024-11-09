const User = require('../../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../../middleware/Auth');

// register controller
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // check if user exists or not with this email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create entry in db
        const user = await User.create({
            email,
            password: hashedPassword
        });

        console.log('New user created =>', user);

        // send response
        return res.status(200).json({
            success: true,
            message: 'User created successfully',
            data: user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// login controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User does not exist'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Create payload with user ID and email
        const payload = {
            id: user._id,
            email: user.email
        };

        const token = generateToken(payload);

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// logout controller
exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');  // Clear the cookie if you are using cookies
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// password reset controller
exports.resetPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // Validate input fields
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
        }

        // Validate current password by comparing it with the hashed password stored in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// get user details
exports.getUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot get user'
        });
    }
};

// delete user
exports.deleteUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            });
        }

        const { password } = req.body;

        // Validate password
        if (!password) {
            return res.status(403).json({
                success: false,
                message: "You must provide a valid password to continue.",
            });
        }

        // Check given password against the db
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        // If password matches, delete user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: 'User account deleted'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// forgot password (simulated OTP logic)
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please provide an email"
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist.'
            });
        }

        // Simulate OTP generation (This is just for demonstration, you should implement actual OTP logic)
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10); // OTP valid for 10 minutes

        // Store OTP and expiration in DB (for simplicity, assume we store it directly in the User model)
        await User.findByIdAndUpdate(user.id, { otp, otpExpiresAt: expirationTime });

        return res.status(200).json({
            success: true,
            message: "OTP generated successfully (no email sent)"
        });
    } catch (error) {
        console.log('Error in forgot password:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// update user details (minimal, since schema only includes email and password)
exports.updateUserDetails = async (req, res) => {
    const userId = req.user.id;
    const { email, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        // Update user fields (email and password are the only fields we can update)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            email,
            password: await bcrypt.hash(password, 10) // hashing new password if provided
        }, { new: true });

        return res.status(200).json({
            success: true,
            updatedUser: updatedUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};


// Logout Controller
exports.logout = (req, res) => {
    try {
        // Optionally, you can clear the token from the client's cookies
        res.clearCookie('token');  // Clear JWT token if it's stored in a cookie

        // Respond with a success message
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
