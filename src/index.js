const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const config = require('./config/config.js');
const initDB = require('./config/initDB');

const Breed = require('./models/Breed.js');
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
app.post('/cats/addCat', upload.single('upload'), async (req, res) => {
    const breedName = req.body.breed;

    const breed = await Breed.findOne({ breed: breedName });

    if (!breed) {
        return res.status(400).send({ error: 'invalid Breed!' });
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
app.get('/cats/:id/edit', async (req, res) => {
    try {
        const cat = await MongoCat.findById(req.params.id).populate('breed').lean();

        const breeds = await Breed.find().lean();
        //TO DO: find a way to show the breeed of the cat on top of the options as selected
        res.render('edit', { cat, breeds });
    } catch (error) {
        throw new Error(error);
    }
});
//OK
app.post('/cats/:id/edit', upload.single('image'), async (req, res) => {
    const breedName = req.body.breed;
    
    try {
        const breed = await Breed.findOne({breed: breedName});
        
        const breedId = breed._id;

        try {
            const cat = await MongoCat.findById(req.params.id);
            console.log(cat)
            const updateData = {
                name: req.body.name,
                breed: breedId,
                description: req.body.description
            }
            //Check if a new image was uploaded
            if (req.file) {
                updateData.imageUrl = `/images/cats/${req.file.originalname}`;
            }
            const updatedCat = await MongoCat.updateOne({_id: cat._id},{$set: updateData})
            
            res.redirect('/');
        } catch (error) {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
});

//OK
app.get('/cats/:id/shelterCat', async(req, res) => {
    try {
        const cat = await MongoCat.findById(req.params.id).populate('breed').lean();
        res.render('shelterCat', { cat });
    } catch (error) {
        throw new Error(error)
    }
    
});
//OK
app.post('/cats/:id/shelterCat', async (req, res) => {
    try {
        const cat  = await MongoCat.findById(req.params.id).populate('breed').lean();
        const catsWithSameImg = await MongoCat.find({imageUrl: cat.imageUrl}).lean();
       if (catsWithSameImg.length === 1) {
            const filePath = path.join(__dirname,'public', cat.imageUrl);
            try {
                if (fs.existsSync(filePath)) {
                    await fs.promises.unlink(filePath);
                } else {
                    throw new Error(`File ${filePath} not found!`);
                }
            } catch (error) {
                console.error(error);
            }
       } 
    
       try {
            await MongoCat.deleteOne({_id: cat._id});
            res.redirect('/');
       } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Error deleting cat from database' });
       }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error finding cat' });
    }
});

initDB()
    .then(() => app.listen(config.PORT, () => { console.log(`Server is running on PORT: ${config.PORT}...`) }))
    .catch((err) => console.log(err));