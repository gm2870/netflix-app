import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  title: String,
  genre_ids: [Number],
});

const Categories =
  mongoose.models.Categories || mongoose.model('Categories', CategorySchema);
export default Categories;
