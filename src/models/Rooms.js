const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    id: {
      type: String
    },
    bets: {
      type: String
    },
    password:{
      type: String
    },
    player: {
      "type": [
        "Mixed"
      ]
    }
  }
)

module.exports = mongoose.model("Rooms",userSchema)

