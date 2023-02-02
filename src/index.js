const express = require('express');
const viewEngineSetup = require('./config/viewEngine');
const routes = require('./routes')

const config = require('./config/config.js');
const initDB = require('./config/initDB');

const app = express();
viewEngineSetup(app);

app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: false }));
app.use(routes);

initDB()
    .then(() => app.listen(config.PORT, () => { console.log(`Server is running on PORT: ${config.PORT}...`) }))
    .catch((err) => console.log(err));