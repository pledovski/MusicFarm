const mongoose = require("mongoose");
const config = require("config");
const mongoURI = config.get("mongoURI");
const path = require('path');
const crypto = require('crypto');

// File upload
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
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

    console.log('MongoDB for files Connected...');
  } catch (err) {
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
  
} 

module.exports = connectFilesDB;