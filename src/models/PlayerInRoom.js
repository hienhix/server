const mongoose = require("mongoose");

const playerInRoom = new mongoose.Schema({
  id: {
    type : String,
    required:false,
    unique: false
  },
  user: {
    type : String,
    required:true,
    
    maxlength:15,
    unique: true
},
avarta: {
  type : String,
  required:false,
  unique: false
},
inGame: {
  type : String,
  required:true,
  minlength:1,
  maxlength:15,
  unique: true
}
 }
)

module.exports = mongoose.model("playerInRoom",playerInRoom)
