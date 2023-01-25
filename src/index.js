const { json } = require('express');
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



app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    const cats = db.cats;
    res.render('index', { cats });
});

app.get('/cats/add', (req, res) => {
    const breeds = db.breeds;
    res.render('addCat', { breeds });
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
        
        const { name, breed, description } = fields;
        //const imgUrl = path.relative(path.join(__dirname, '..'),path.join(__dirname,'public', 'images', 'cats', files.upload.originalFilename));
        const imgUrl = '/images/cats/' + files.upload.originalFilename;
        console.log(`imgUrl: ${imgUrl}`);
        
        fs.rename(files.upload.filepath, imgUrl, (err) => {
            if (err) {
                return console.log(err)
                
            }
            console.log('File moved to:', imgUrl);
        });
        let cat = new Cat(name, breed, imgUrl, description);
        await cat.save();
        
    });
    res.redirect('/');
});

app.get('/cats/add-breed', (req, res) => {
    res.render('addBreed');
});

app.post('/cats/add-breed', async (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
        if (err) {
            return console.log(`Error by parsing form: ${err}`);
        }
    
    let newBreed = fields.breed;
    console.log(`newBreed: ${newBreed}`);

    let breedsArr = await readBreads();
    console.log(`BreedsArr -> ${breedsArr}`);

    //breedsArr.push(newBreed);
    breedsArr = await writeBreeds(newBreed);

    console.log(`BreedsArr after push()-> ${breedsArr}`);


    }); 
    res.redirect('/');
});

async function readBreads() {
    try {
        const data = await fs.promises.readFile(path.resolve(__dirname, './db.json'));
        let db = JSON.parse(data);
        return db.breeds;
    } catch (error) {
        console.log(`Erorr trying to readBread> ${error}`);
    }
}

async function writeBreeds(breed) {
    try {
        const data = await fs.promises.readFile(path.resolve(__dirname, './db.json'));
        let db = JSON.parse(data);
        db.breeds.push(breed);
        const jsonData = JSON.stringify(db, null, 2);
        await fs.promises.writeFile(path.resolve(__dirname, './db.json'), jsonData);
        console.log('Data written to file by writeBreeds() function');
        return db.breeds;
    } catch (error) {
        console.log(`Erorr trying to writeBread> ${error}`);
    }
}

app.get('/edit/:id', (req, res) => {
    let catId = Number(req.params.id);
    let breeds = db.breeds;
    let cat = db.cats.find(el => el.id === catId);
    console.log(`Cat -> ${cat.id}`);
    res.render('edit', { cat, breeds });
});



//we will use next line when the config setup is fixed!
//app.listen(config.PORT, () => {consle.log(`Server is running on port ${config.PORT}...`)});
app.listen(port, () => {console.log(`Server is running on port ${port}...`)});