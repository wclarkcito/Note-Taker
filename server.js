//Dependencies

const express = require('express');
const fs = require('fs');
const path = require("path");
const uniqid = require("uniqid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data
//Routes

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get("/api/notes", (req, res) => res.sendFile(path.join(__dirname, "/db/db.json")));


// Displays todays note
app.post('/api/notes/', (req, res) => {
    var note = req.body;
    var id = uniqid();
    note.id = id;
    //console.log(note);

    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;

        let dbFile = JSON.parse(data);
        // console.log(dbFile);

        dbFile.push(note);
        console.log(dbFile)
        //write the data
        // fs.writeFile("./db/db.json", JSON.stringify(dbFile), "utf-8", err => {
        //     if (err) throw err;
        //     console.log("Your note was saved")
        // })
    })

    res.redirect("/notes");

})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));