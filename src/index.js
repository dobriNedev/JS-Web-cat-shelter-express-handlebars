const express = require('express');
const handlebars = require('express-handlebars');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
//setup needs to be fixed
//const config = require('./config/config.js'); 
const db = require('./db.json');
const Cat = require('./models/Cat');
const port = 5001;

const app = express();

app.engine('hbs', handlebars.engine({extname: 'hbs'}));
app.use(express.static('src/public'));
app.set('view engine', 'hbs');
app.set('views', './src/views');



//app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    const cats = db.cats;
    res.render('index', { cats });
});

app.get('/cats/add', (req, res) => {
    res.render('addCat');
});

// app.post('/cats/add', (req, res) => {
//     let form = new formidable.IncomingForm();
//     form.parse(req, (err, fields, files) => {
//         if(err) {
//             return console.error(err);
//         }
        
//         const { name, breed, description } = fields;
//         const imgUrl = '/images/cats/' + files.upload.originalFilename;
//         console.log(`imgUrl: ${imgUrl}`);
//         fs.rename(files.upload.filepath, imgUrl, (err) => {
//             if (err) throw err;
//             console.log('File moved to:', imgUrl);
//         });
//         let cat = new Cat(name, breed, imgUrl, description);
//         cat.save();
        
//         res.redirect('/');
//     });
// });

app.post('/cats/add', async (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if(err) {
            return console.error(err);
        }
        console.log(`FilesUpload: ${files.upload.originalFilename}`);
        const { name, breed, description } = fields;
        //const imgUrl = path.relative(path.join(__dirname, '..'),path.join(__dirname,'public', 'images', 'cats', files.upload.originalFilename));
        let imgUrl = '/images/cats/' + files.upload.originalFilename;
        console.log(`imgUrl: ${imgUrl}`);
        
        fs.rename(files.upload.filepath, imgUrl, (err) => {
            if (err) {
                console.log(err)
                
            }
            console.log('File moved to:', imgUrl);
        });
        let cat = new Cat(name, breed, imgUrl, description);
        await cat.save();
        res.redirect('/');
    });
});

app.get('/cats/add-breed', (req, res) => {
    res.render('addBreed');
});


//we will use next line when the config setup is fixed!
//app.listen(config.PORT, () => {consle.log(`Server is running on port ${config.PORT}...`)});
app.listen(port, () => {console.log(`Server is running on port ${port}...`)});