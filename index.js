// 1. Importer le module Express
const express = require('express');
// 1.1. Importer le module Mongoose
const mongoose = require('mongoose');
// 1.2. Importer le module ContactMessage
const ContactMessage = require('./models/ContactMessage');
// 1.3. Importer les fonctions body et validationResult
const {body, validationResult} = require('express-validator');
//1.4. Importer le module cors 
const cors = require('cors');
// 1.5. Importer le module .env
require('dotenv').config();

// 2. Créer une instance de l'application Express
const app = express();



// 2.1. Configurer Express pour analyser les requêtes JSON et URL-encodées
app.use(express.json()); // Pour analyser les corps de requêtes JSON
app.use(express.urlencoded( {extends:true})); // Pour analyser les corps de requêtes URL-encodées (formulaires HTML)

//2.2. UTILISATION DE CORS : Permet aux requêtes provenant d'autres origines (comme ton frontend React) d'accéder à ton API
app.use(cors());


// 2.2. Connexion à MongoDB.
// cette variable vient du fichier .env
const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI)
.then(() => console.log('connecté à mongoDB avec Succès !'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));

// 2.3. Configurer Express pour servir les fichiers statiques (notre HTML, CSS, JS frontend, etc.)
app.use(express.static('public'));


// 3. Définir le port sur lequel le serveur va écouter
// Expliquons : process.env.PORT est pour l'environnement de production (ex: Heroku),
// et 3000 est pour le développement local si PORT n'est pas défini.
const PORT = process.env.PORT || 3000


// 4. Définir une route (endpoint) basique
// Route de base pour indiquer que c'est une API
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur l\'API de formulaire de contact ! Accédez à /messages pour les messages ou /submit-form pour soumettre.' });
});


app.post('/submit-form', 
    [// Tableau de middlewares de validation
        body('nom').trim().notEmpty().withMessage('Le nom est obligatoire.').isLength({min:2}).withMessage('Le nom doit contenir au moins 2 caractères.'), 
        body('email').trim().notEmpty().withMessage('L\'email est obligatoire.').isEmail().withMessage('Veuillez entrer une adresse email valide.'),
        body('message').trim().notEmpty().withMessage('Le message est obligatiore.').isLength({min:10, max:500}).withMessage('Le message doit contenir entre 10 et 500 caractères.')
        ],
    async (req, res) => {
    // A. Récupérer les erreurs de validation ici
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        // B. S'il y a des erreurs, les renvoyer au client
        return res.status(400).json({errors : errors.array()})
    }
    
    //Récupère les données du formulaire
    // Les données du formulaire sont disponibles dans req.body grâce aux middlewares précédents
    const formData = req.body;
    console.log('données reçues du formulaire : ', formData);

    try {
        
        // 1. Créer une nouvelle instance de ContactMessage
        const newMessage =  new ContactMessage(formData);
        await newMessage.save();
        
        // Envoie une réponse au client pour confirmer la réception
        res.status(200).send('Message envoyé avec succés');
        // res.status(200) définit le code de statut HTTP à 200 (OK)
        // .send() envoie la réponse
        
    } catch (error) {
        next(error);

    }    
})

app.get('/messages', async (req, res, next) => {

    try {        

        const allMessages = await ContactMessage.find();
        res.json(allMessages);
    } catch (error) {
        next(error);
    }

});

// 6. Middleware de gestion d'erreurs global
// Cette fonction avec 4 arguments (err, req, res, next) est reconnue par Express comme un gestionnaire d'erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const errMessage = err.Message || 'Une erreur est survenue sur le serveur.';

    // En mode développement, envoie plus de détails au client
    if(process.env.NODE_ENV === 'developpement') {
        res.status(statusCode).json({
            message : errMessage,
            stack : err.stack,
            error : err
        });        
    }
    else {
        // En mode production, envoie un message générique
        res.status(500).send('Une erreur est survenue sur le serveur.');

    }

}) 

// 5. Démarrer le serveur et le faire écouter sur le port défini
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Accès local : http://localhost:${PORT}`);
})

