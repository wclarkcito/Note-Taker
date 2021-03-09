//Dependencies

const { json } = require('express');
const express = require('express');
const fs = require('fs');
const path = require("path");
const uniqid = require("uniqid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


//Routes

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        if (data.length > 0) {
            res.sendFile(path.join(__dirname, "/db/db.json"))
        } else {
            res.send([])
        }
    })

});


// Displays todays note
app.post('/api/notes/', (req, res) => {
    var note = req.body;
    var id = uniqid();
    note.id = id;
    //console.log(note);

    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        console.log(data.length);
        let dbFile;
        if (data.length > 0) {
            dbFile = JSON.parse(data);
        } else {
            dbFile = []
        }

        // console.log(dbFile);

        dbFile.push(note);
        console.log(dbFile)
        // write the data
        fs.writeFile("./db/db.json", JSON.stringify(dbFile), "utf-8", err => {
            if (err) throw err;
            console.log("Your note was saved")
        })
    })

    res.redirect("/notes");

})


// delete function

app.delete('/api/notes/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    let index = 0
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        let dbFile = JSON.parse(data);
        for (let i = 0; i < dbFile.length; i++) {
            if (id === dbFile[i].id) {
                index = i
                break
            }

        }
        dbFile.splice(index, 1);
        fs.writeFile("./db/db.json", JSON.stringify(dbFile), "utf-8", err => {
            if (err) throw err;
            console.log("Your note was removed")
            res.send()
        })
    })

})
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));