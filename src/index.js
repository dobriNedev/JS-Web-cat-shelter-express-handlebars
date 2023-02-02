const express = require('express');
const viewEngineSetup = require('./config/viewEngine');
const routes = require('./routes')
const fs = require('fs');
const path = require('path');
const config = require('./config/config.js');
const initDB = require('./config/initDB');

const app = express();
viewEngineSetup(app);

app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: false }));
app.use(routes);

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