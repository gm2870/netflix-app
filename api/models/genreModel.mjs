import { Schema, model } from 'mongoose';

const schema = {
  id: Number,
  name: String,
  has_country: Boolean,
  has_user_profile: Boolean,
  types: [String],
};

const genreSchema = new Schema(schema);

genreSchema.pre(/^find/, function (next) {
  this.find().select(['-__v', '-_id']);
  next();
});

const Genre = model('Genres', genreSchema);
export default Genre;
