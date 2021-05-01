const mongoose = require('mongoose')

const AllowSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: true,
  },
  emailList: {
    type: [String],
    required: false,
  },
})

module.exports = mongoose.model('Allow', AllowSchema)