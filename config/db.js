const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectUserDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    } );

    console.log('MongoDB for users Connected...');
  } catch(err) {
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
}

module.exports = connectUserDB;