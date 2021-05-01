const mongoose = require('mongoose')

const RoundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  datePublish: {
    type: Date,
    required: true,
  },
  dateRemove: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'private',
    enum: ['public', 'private'],
  },
  division: {
    type: String,
    default: 'open',
    enum: ['open','silver', 'gold','platinum'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imageNames: {
    type: [String],
    required: false,
  },
  imageLinks: {
    type: [String],
    required: false,
  },
  imageChecksums: {
    type: [String],
    required: false,
  },
})

module.exports = mongoose.model('Round', RoundSchema)