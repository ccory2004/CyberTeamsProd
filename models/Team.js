const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
  cpId: {
    type: String,
    required: false,
  },
  teamName: {
    type: String,
    required: true,
  },
  cpUniqueCode: {
    type: String,
    required: false,
  },
  division: {
    type: String,
    required: true,
    enum: ['open','silver', 'gold','platinum'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('Team', TeamSchema)