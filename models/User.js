import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'recruiter', 'manager'],
    default: 'recruiter'
  },
  department: {
    type: String,
    enum: ['IT', 'HR', 'Sales', 'Marketing', 'Operations', 'Finance', 'Legal'],
    default: 'HR'
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  permissions: [{
    type: String,
    enum: [
      'job.create',
      'job.read',
      'job.update',
      'job.delete',
      'application.read',
      'application.update',
      'application.delete',
      'contact.read',
      'contact.update',
      'contact.delete',
      'user.create',
      'user.read',
      'user.update',
      'user.delete',
      'analytics.view'
    ]
  }],
  profile: {
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    linkedin: {
      type: String,
      maxlength: [200, 'LinkedIn URL cannot exceed 200 characters']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for time since last login
userSchema.virtual('timeSinceLastLogin').get(function() {
  if (!this.lastLogin) return 'Never';
  
  const now = new Date();
  const diff = now - this.lastLogin;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user permissions based on role
userSchema.methods.getPermissions = function() {
  const rolePermissions = {
    admin: [
      'job.create', 'job.read', 'job.update', 'job.delete',
      'application.read', 'application.update', 'application.delete',
      'contact.read', 'contact.update', 'contact.delete',
      'user.create', 'user.read', 'user.update', 'user.delete',
      'analytics.view'
    ],
    hr: [
      'job.create', 'job.read', 'job.update',
      'application.read', 'application.update',
      'contact.read', 'contact.update',
      'analytics.view'
    ],
    recruiter: [
      'job.create', 'job.read', 'job.update',
      'application.read', 'application.update',
      'contact.read'
    ],
    manager: [
      'job.read', 'job.update',
      'application.read', 'application.update',
      'contact.read',
      'analytics.view'
    ]
  };
  
  return rolePermissions[this.role] || [];
};

// Method to check if user has specific permission
userSchema.methods.hasPermission = function(permission) {
  const userPermissions = this.getPermissions();
  return userPermissions.includes(permission);
};

// Index for better search performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ department: 1 });
userSchema.index({ firstName: 'text', lastName: 'text' });

const User = mongoose.model('User', userSchema);

export default User;
