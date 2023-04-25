import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = {
  id: Number,
  name: String,
  has_country: Boolean,
  has_user_profile: Boolean,
};

const genreSchema = new Schema({
  tv: [schema],
  movie: [schema],
});

const Genre = mongoose.model('Genres', genreSchema);

export default Genre;
