import mongoose from 'mongoose';

const tokenSchema = mongoose.Schema({
  token: String,
  user_id: mongoose.Schema.Types.ObjectId,
  expires_at: Date,
  last_used_at: Date,
  compromised_at: Date,
  type: {
    type: String,
    enum: ['REFRESH', 'ACCESS'],
  },
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
