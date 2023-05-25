import TV from '../models/media/tvModel.mjs';

const updateTVSrc = async () => {
  const list = await TV.find();
  console.log(list);
};
updateTVSrc();
