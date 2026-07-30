// const cloudinary = require('./config/cloudinary');

// (async () => {
//   try {
//     const result = await cloudinary.uploader.upload(
//       './public/img/events/new-tour-1.jpg',
//     );

//     console.log(result.secure_url);
//   } catch (err) {
//     console.log(err);
//   }
// })();

require('dotenv').config({ path: './config.env' });

const cloudinary = require('./config/cloudinary');

(async () => {
  try {
    const result = await cloudinary.uploader.upload(
      './public/img/events/new-tour-1.jpg',
    );

    console.log(result.secure_url);
  } catch (err) {
    console.log(err);
  }
})();
