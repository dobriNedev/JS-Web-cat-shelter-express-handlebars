const express = require('express');
const handlebars = require('express-handlebars');
//setup needs to be fixed
//const config = require('./config/config.js'); 
const db = require('./db.json');
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
    res.render('addCat');
});


//we will use next line when the config setup is fixed!
//app.listen(config.PORT, () => {consle.log(`Server is running on port ${config.PORT}...`)});
app.listen(port, () => {console.log(`Server is running on port ${port}...`)});