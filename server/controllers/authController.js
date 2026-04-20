import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register a new user
export const register = async (req, res) => {
  const { name, email, password, role, phone, skills, experience, companyName, companyDescription, companyWebsite } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object based on role
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'jobseeker',
    };

    // Add role-specific fields
    if (role === 'jobseeker') {
      userData.phone = phone;
      userData.skills = skills || [];
      userData.experience = experience;
    } else if (role === 'company') {
      userData.companyName = companyName;
      userData.companyDescription = companyDescription;
      userData.companyWebsite = companyWebsite;
    }

    const newUser = await User.create(userData);

    // Generate token
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        skills: newUser.skills,
        companyName: newUser.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        companyName: user.companyName,
        phone: user.phone,
        resume: user.resume,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Logout user (client-side token removal, but we can track it server-side if needed)
export const logout = (req, res) => {
  res.status(200).json({ message: 'User logged out successfully' });
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  const { name, phone, skills, experience, resume, companyName, companyDescription, companyWebsite } = req.body;

  try {
    const updateData = { name, phone };

    // Role-specific updates
    if (req.user.role === 'jobseeker') {
      updateData.skills = skills;
      updateData.experience = experience;
      if (resume) updateData.resume = resume;
    } else if (req.user.role === 'company') {
      updateData.companyName = companyName;
      updateData.companyDescription = companyDescription;
      updateData.companyWebsite = companyWebsite;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};