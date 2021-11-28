# Text Translator using Google Translation 
It is a text translater which translate any text of any language to any other language supported by google at free of cost. Developed using Nodejs express, this app exposes a post REST API for translating the text. The format of data to be send via the API is defined below. You just have to call the API and API will give you the desired results. It will through error as well for any of the typo error or some logicals errors like you want to convert a text from english to japenese but the text has been given in marathi then it will through an error. All the error handling has been done at the application level. 

This app is using MongoDB as it's caching database, so if you query for translation that was once asked by you before it will just use it's cache memory to answer your query thus reducing it's response time.

---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
---

## Install

#### Just clone the repository

```
git clone https://github.com/mostlypanda/Text-Translator-using-Nodejs.git
```

#### Now heading towards the code directory    
    
```  
cd Text-Translator-using-Nodejs
```

#### Install all the dependencies    

```
npm install
```

## Configure app

- Now you have to create a file named as ```.env``` that contains the database link to connect to mongoose and just save it and you are good to go.

## Running the project

```
npm start
```

---

## App Structure

```
/app.js - This is the main of the app having code of all the API's and app formation and listening and DB connection
/Language DB/ languages.js - This file contains all the languages support by the app and their manipulations.
/Models/ model.js - This contains the schema of cache object 
/Assets - Contains image assets for Readme
```
---

## API Format

```
The REST API endpoint is '/api/translate/'

And the format of data to be send via the API in the body of API

{
    "to" : "chinese simplified",
    "from" : "English",
    "text" : "That person is calling you"
}

where 'to' is the target language
      'from' is language of given text
      'text' is the data to be translated. 

```
## Demonstration

### For successful request
![](https://github.com/mostlypanda/Text-Translator-using-Nodejs/blob/main/Assets/API%20Working.png)

