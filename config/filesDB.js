const mongoose = require("mongoose");
const config = require("config");
const mongoURI = config.get("mongoURI");

// File upload
const Grid = require("gridfs-stream");

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

//Init gfs
let gfs;

const connectFilesDB = async () => {
  try {
    await conn.once("open", () => {

      //Init stream
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("uploads");
    });

    console.log('MongoDB-fileBase Connected...');
  } catch (err) {
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
  
} 

module.exports = connectFilesDB;