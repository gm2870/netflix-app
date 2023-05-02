import mongoose from 'mongoose';

const tokenSchema = mongoose.Schema({
  token: String,
  user_id: Number,
  expires_at: Date,
  last_used_at: Date,
  compromised_at: Date,
  type: {
    enum: ['REFRESH', 'ACCESS'],
  },
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
