const mongoose = require('mongoose');


const FileStored = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  ftp_data:{type:Array,required:true}
},{
  collation:"FileStored",
});

mongoose.model("FileStored",FileStored);
