import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, 'Please confirm your password'],
  //   validate: {
  //     validator: (el) => el === this.password,
  //     message: 'Password do not match',
  //   },
  // },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  blocked_at: Date,
});

UserSchema.pre('save', async function (next) {
  // if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async (candidatePass, userPass) => {
  const correct = await bcrypt.compare(candidatePass, userPass);
  return correct;
};

UserSchema.pre(/^find/, function (next) {
  this.find().select('-__v');
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
