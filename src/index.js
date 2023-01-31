const express = require('express');
const handlebars = require('express-handlebars');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const config = require('./config/config.js'); 
const initDB = require('./config/initDB');

const db = require('./db.json');
const Breed = require('./models/Breed.js');
const Cat = require('./models/Cat');
const upload = require('./upload');
const MongoCat = require('./models/MongoCat');

const app = express();

app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.use(express.static('src/public'));
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: false }));
//OK
app.get('/', async (req, res) => {
    try {
        const cats = await MongoCat.find().populate('breed').lean();
        
        res.render('index', { cats });
    } catch (error) {
        throw new Error(error);
    }
});
//OK
app.get('/cats/addCat', async (req, res) => {
    try {
        const breeds = await Breed.find().lean();
        res.render('addCat', { breeds });
    } catch (error) {
        throw new Error(error);
    }
});
//OK
app.post('/cats/addCat',upload.single('upload'), async (req, res) => {
    const breedName = req.body.breed;
    
    const breed = await Breed.findOne({breed: breedName});
    
    if (!breed) {
        return res.status(400).send({error:'invalid Breed!'});
    }
    const breedId = breed._id;
   
    const imgUrl = '/images/cats/' + req.file.originalname;
    
    const cat = new MongoCat({
        name: req.body.name,
        imageUrl: imgUrl,
        breed: breedId,
        description: req.body.description
      });

    try {
        await cat.save();
        res.redirect('/');
    } catch (error) {
        throw new Error(error);
    }  
});
//OK
app.get('/cats/addBreed', (req, res) => {
    res.render('addBreed');
});
//OK
app.post('/cats/addBreed', async (req, res) => {
    const { breed } = req.query;
    
    try {
        await Breed.create({ breed });
    } catch (error) {
        console.log(error);
    }

    res.redirect('/');
});
//OK
app.get('/cats/:id/edit', async(req, res) => {
    const cat = await MongoCat.findById(req.params.id).populate('breed').lean();
    
    const breeds = await Breed.find().lean();
    //TO DO: find a way to show the breeed of the cat on top of the options as selected
    res.render('edit', { cat , breeds});
});

app.post('/cats/:id/edit', async (req, res) => {
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

app.get('/cats/:id/shelterCat', (req, res) => {
    const catId = Number(req.params.id);
    const cat = db.cats.find(el => el.id === catId);
    res.render('shelterCat', { cat });
});

app.post('/cats/:id/shelterCat', async(req, res) => {
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

initDB()
    .then(() => app.listen(config.PORT, () => {console.log(`Server is running on PORT: ${config.PORT}...`)}))
    .catch((err) => console.log(err));