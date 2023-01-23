const db = require('../db.json');
const fs = require('fs');
const path = require('path');

class Cat {
    constructor(name, breed, imgUrl, description) {
        this.name = name,
        this.breed = breed,
        this.imgUrl = imgUrl,
        this.description = description
    }

    save() {
        this.id = db.cats[db.cats.length -1].id + 1;
        db.cats.push(this);
        const jsonData = JSON.stringify(db, null, 2);
        try {
            fs.promises.writeFile(path.resolve(__dirname, '../db.json'), jsonData);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Cat;