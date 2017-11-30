var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
   name: String,
   description: String,
   expiration_date: Object,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Todo", todoSchema);
