const express = require('express');
const app = express();
const connection = require('./conf');
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (request, response) => {
    response.send('Bienvenue sur Express');
});

app.get('/api/champions', (req, res) => { // récupération des données de la table
    connection.query('SELECT * from champions', (err, results) => {
        if (err) {
            res.status(500).send('Erreur');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/champions/name', (req, res) => { // récupération des names de la table
    connection.query('SELECT name from champions', (err, results) => {
        if (err) {
            res.status(500).send('Erreur');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/champions/description/:mot', (req, res) => { // récupération des champions dont la description contient mot
    const mot = '%' + req.params.mot + '%';
    connection.query('SELECT * from champions WHERE description LIKE ?', [mot], (err, results) => {
        if (err) {
            res.status(500).send('Erreur');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/champions/released', (req, res) => { // récupération des champions released
    connection.query('SELECT * from champions WHERE dateOfRealease < NOW()', (err, results) => {
        if (err) {
            res.status(500).send('Erreur');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/champions/name/:debut', (req, res) => { // récupération d'un champion par son nom
    const nameChamp = req.params.debut + '%';
    connection.query('SELECT * from champions WHERE name LIKE ?', [nameChamp], (err, results) => {
        if (err) {
            res.status(500).send('Erreur');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/champions/order/:choisi', (req, res) => { // récupération des données de la table ordonnées par ID
    const choix = req.params.choisi
    connection.query('SELECT * from champions ORDER BY id ?', [choix], (err, results) => { // CA MARCHE PAS
        if (err) {
            res.status(500).send('Erreur');
        } else {
            res.json(results);
        }
    });
});

app.post('/api/champion', (req, res) => {
    const data = req.body;
    connection.query('INSERT INTO champions VALUES ?', [data], (err, results) => { // Pas réussi à tester
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la sauvegarde d'un champion");
        } else {
            res.sendStatus(200);
        }
    });
});

app.put('api/champions/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    connection.query('UPDATE champions SET ? WHERE id = ?', [data, id], err => {
        if (err) {
            res.status(500).send("Erreur lors de la modification d'un champion");
        } else {
            res.sendStatus(200);
        }
    });
});

app.put('api/champions/own/:bool', (req, res) => {
    const bool = req.params.bool;
    const data = req.body;
    connection.query('UPDATE champions SET ? WHERE id = ?', [data, bool], err => {
        if (err) {
            res.status(500).send("Erreur lors de la modification d'un champion");
        } else {
            res.sendStatus(200);
        }
    });
});

app.delete('api/champions/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM champions WHERE id = ?', [id], err => {
        if (err) {
            res.status(500).send("Erreur lors de la suppression d'un champion");
        } else {
            res.sendStatus(200);
        }
    });
});

app.delete('api/champions/:bool', (req, res) => {
    const bool = req.params.bool;
    connection.query('DELETE FROM champions WHERE bool = ?', [bool], err => {
        if (err) {
            res.status(500).send("Erreur lors de la suppression des champions");
        } else {
            res.sendStatus(200);
        }
    });
});

// Listen et fin du fichier

app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }

    console.log(`Server is listening on ${port}`);
});