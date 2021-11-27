const mongoose = require('mongoose');

// Defining the Schema of cache Database
const Searchedtext = mongoose.Schema({

    text: {
        type: String,
        required: true
    },
    target_text: {
        type: String,
        required: true
    },
    target_lang: {
        type: String,
        required: true
    },
    from_lang: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Searchedtext', Searchedtext);