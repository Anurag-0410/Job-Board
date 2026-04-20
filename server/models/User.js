import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['jobseeker', 'company', 'admin'],
    default: 'jobseeker',
  },
  // Profile fields for job seekers
  phone: {
    type: String,
  },
  resume: {
    type: String, // URL to resume file
  },
  skills: [{
    type: String,
  }],
  experience: {
    type: String, // e.g., "0-1 years", "1-2 years"
  },
  // Company fields
  companyName: {
    type: String,
  },
  companyDescription: {
    type: String,
  },
  companyWebsite: {
    type: String,
  },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;