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

    async save() {
        try {
            // Read the contents of the db.json file
            const data = await fs.promises.readFile(path.resolve(__dirname, '../db.json'));
    
            // Parse the JSON data
            let db = JSON.parse(data);
    
            // Assign an ID to the new cat object
            this.id = db.cats[db.cats.length -1].id + 1;
    
            // Append the new cat object to the cats array
            db.cats.push(this);
    
            // Stringify the updated db object
            const jsonData = JSON.stringify(db, null, 2);
    
            // Write the updated data back to the db.json file
            await fs.promises.writeFile(path.resolve(__dirname, '../db.json'), jsonData);
            console.log('Data written to file trough save() method of Cat class');
        } catch (err) {
            console.error(`Error at cat.save(): ${err}`);
        }
    }
    
}

module.exports = Cat;