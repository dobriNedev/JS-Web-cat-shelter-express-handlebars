const express = require('express');
const handlebars = require('express-handlebars');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const config = require('./config/config.js'); 
const db = require('./db.json');

//const port = 5001;

const app = express();

app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.use(express.static('src/public'));
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    try {
        const data = await fs.promises.readFile(path.resolve(__dirname, './db.json'));
        const db = JSON.parse(data);
        res.render('index', { cats: db.cats});
    } catch (error) {
        console.error(`Error at GET / : ${error}`);
    }
});

app.get('/cats/add', (req, res) => {
    const breeds = db.breeds;
    res.render('addCat', { breeds });
});

app.post('/cats/add', async (req, res) => {
    let form = new formidable.IncomingForm();
    let imgUrl = '';
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return console.error(err);
        }
        const { name, breed, description } = fields;
       
        imgUrl = path.join(__dirname,'/public/images/cats/', files.upload.originalFilename);
    
        fs.rename(files.upload.filepath, imgUrl, (err) => {
            if (err) {
                return console.log(`Error by parsing form when adding cat: ${err}`)

            }
            imgUrl = '/images/cats/' + files.upload.originalFilename;
        });
        imgUrl = '/images/cats/' + files.upload.originalFilename;
        let cat = new Cat(name, breed, imgUrl, description);
        await cat.save();
        res.redirect('/');
    });
});

app.get('/cats/add-breed', (req, res) => {
    res.render('addBreed');
});

app.post('/cats/add-breed', async (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
        if (err) {
            return console.log(`Error by parsing form when adding breed: ${err}`);
        }
        let newBreed = fields.breed;

        let breedsArr = await readBreads();

        breedsArr = await writeBreeds(newBreed);
        res.redirect('/');
    });
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
        console.error(`Erorr trying to writeBread> ${error}`);
    }
}

app.get('/edit/:id', (req, res) => {
    const catId = Number(req.params.id);
    const breeds = db.breeds;
    const cat = db.cats.find(el => el.id === catId);
    res.render('edit', { cat, breeds });
});

app.post('/edit/:id', async (req, res) => {
    const catId = Number(req.params.id);
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return console.log(`Error by parsing form when editing cat: ${err}`);
        }

        let cat = db.cats.find(el => el.id === catId);
        if (!cat) {
            res.status(404).send('There is no cat with the given ID found!');
        }

        const { name, breed, description } = fields;
        
        await editCat(catId, name, breed, description);
        
        res.redirect('/');
    });
});

async function editCat(id, name, breed, description) {
    try {
        const data = await fs.promises.readFile(path.resolve(__dirname, './db.json'));
        let db = JSON.parse(data);

        let cat = db.cats.find(el => el.id === id);

        cat.name = name;
        cat.breed = breed;
        cat.description = description;

        const jsonData = JSON.stringify(db, null, 2);
        await fs.promises.writeFile(path.resolve(__dirname, './db.json'), jsonData);
        console.log('Data written to file trough editCat()');
        return db;
    } catch (error) {
        console.error(`Error at editCat(): ${error}`);
    }
}

app.get('/shelter-cat/:id', (req, res) => {
    const catId = Number(req.params.id);
    const cat = db.cats.find(el => el.id === catId);
    res.render('shelterCat', { cat });
});

app.post('/shelter-cat/:id', async(req, res) => {
    const catId = Number(req.params.id);
    try {
        const data = await fs.promises.readFile(path.resolve(__dirname, './db.json'));
        const db = JSON.parse(data);
        //db.cats.filter(el => el.id !== catId); needs to be assigned to variable/constant
        let cat = db.cats.find(el => el.id === catId);
        let index = db.cats.indexOf(cat);
        db.cats.splice(index, 1);
        const jsonData = JSON.stringify(db, null, 2);
        await fs.promises.writeFile(path.resolve(__dirname, './db.json'), jsonData);
        console.log(`Data written to file when deleting resource`);
        res.redirect('/');
    } catch (error) {
        console.error(`Error at deleteCat(): ${error}`);
    }
});

//app.listen(config.PORT, () => {consle.log(`Server is running on port ${config.PORT}...`)});
app.listen(port, () => { console.log(`Server is running on port ${port}...`) });