const mongoose = require('mongoose');

// Définir le schéma pour les messages de contact
const ContactMessageShcema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        // Validation simple de l'email via une regex
        match: [/.+@.+\..+/, 'Veuillez entrer une adresse email valide']
    },
    message: {
        type: String,
        required: true,
        trim: true,        
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Créer le modèle à partir du schéma
// 'ContactMessage' sera le nom de la collection dans MongoDB (au pluriel : 'contactmessages')
const ContactMessage = mongoose.model('ContactMessage', ContactMessageShcema);

// Exporter le modèle pour qu'il puisse être utilisé ailleurs
module.exports = ContactMessage;