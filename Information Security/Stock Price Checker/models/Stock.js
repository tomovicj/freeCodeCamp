const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    likes: {
        type: [String],
        required: true,
        default: []
    }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
