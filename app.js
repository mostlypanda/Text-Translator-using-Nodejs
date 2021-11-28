require('dotenv').config();

const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const Translate = require('@vitalets/google-translate-api');
const cors = require('cors');


// Importing functions for language type manupulation
const getlangcode = require('./Language DB/languages').getlangcode;
const checklang = require('./Language DB/languages').checklang;

// Importing cache model
const Searchedtext = require('./Models/Model')

// Defining the app
const app = express();

// Allowing app to use the body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(cors());

// Enabling the database connection

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
}).then(() => {

    console.log("Database is connected");

}).catch((err) => {

    console.log(err);
    process.exit();

}) /


    // Starting route
    app.get('/api/', (req, res) => {
        res.status(200).json({
            "msg": "Welcome to the translation tool"
        });
    })


// POST REST Api for translating the text from one to another languages both provided from the user
app.post('/api/translate', (req, res) => {

    // If any field is left empty an error will be thrown
    if (!req.body.text || !req.body.to || !req.body.from)
        return res.status(406).json({
            "msg": "Please fill all the required fields"
        });

    // Making a dummy object for storing the user's data
    let translate = {
        lang_to: req.body.to,
        lang_from: req.body.from,
        text: req.body.text
    };


    // Checking whether provided languages are supported by our translator or not 
    if (!checklang(translate.lang_to) || !checklang(translate.lang_from))
        return res.status(409).json({
            "msg": "any of the given input languages is not supported"
        })


    // Translating language names to ISO 639-1 code    
    translate.lang_from = getlangcode(translate.lang_from);
    translate.lang_to = getlangcode(translate.lang_to);

    let flag = false;
    // First Searching whether the above query have been searched by user before
    Searchedtext.find({
        text: translate.text
    }).sort({
        createdAt: 'desc'
    }).exec().then((text_obj) => {

        // If it has been searched before just return the target text
        if (text_obj) {
            text_obj.forEach(obj => {

                if (obj.target_lang === translate.lang_to && obj.from_lang === translate.lang_from) {
                    flag = true;
                    return res.status(200).json("Your target text is : " + obj.target_text);
                }

            });
        }

        // If the query has not been found in cache databse just first translate the text and then create a cache object to be stored in the memory
        if (!flag) {

            // Calling translation API

            Translate(translate.text, {
                to: translate.lang_to,
                from: translate.lang_from
            }).then(
                (data) => {
                    // Let's check that given text follow the rule of it's given language grammar
                    var check = data.from.language.iso;

                    // If it don't follow then throw an error
                    if (check !== translate.lang_from) {
                        return res.status(400).json({ "msg": "The given text is not in the format of it's given language" });
                    }
                    // Creating the cache object
                    const cached_obj = new Searchedtext({
                        text: translate.text,
                        target_lang: translate.lang_to,
                        from_lang: translate.lang_from,
                        target_text: data.text
                    });

                    // Saving the cache object
                    cached_obj.save().then(
                        (cache_obj) => {
                            // Returning the result
                            return res.status(200).json("Your target text is : " + data.text);
                        }
                    ).catch((err) => {
                        return res.status(500).json(err);
                    })

                }
            ).catch((err) => {
                return res.status(500).json(err);
            })
        }

    }).catch((err) => {

        return res.status(500).json(err);

    })

});


// Handling wrongful requests
app.get('*', (req, res) => {
    res.redirect('/api/');
})


// Defining port
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else {
        console.log(`app is live at ${PORT}`);
    }
})