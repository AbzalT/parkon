const mongoose = require('mongoose')
const Schema = mongoose.Schema

const nnSchema = new Schema({
    timestamp: {
        type: String,
    },
    cam_id: {
        type: String,
    },
    result: [Number],
})

module.exports = mongoose.model('nn_outputs', nnSchema)
