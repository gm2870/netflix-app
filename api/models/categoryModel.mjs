import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  title: String,
  genre_ids: [Number],
});

const Categories = mongoose.model('categories', CategorySchema);
export default Categories;
