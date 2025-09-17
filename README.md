# Formulaire de Contact - Backend API

Ce dépôt contient le code source de l'API RESTful pour l'application de formulaire de contact. Il gère la réception des soumissions, la validation des données, la persistance dans une base de données MongoDB, et la récupération des messages de contact.

## Technologies Utilisées

*   **Node.js**
*   **Express.js** (Framework web pour Node.js)
*   **Mongoose** (ODM - Object Data Modeling pour MongoDB)
*   **MongoDB** (Base de données NoSQL)
*   **CORS** (Middleware pour la gestion des requêtes cross-origin)
*   **dotenv** (Pour la gestion des variables d'environnement)
*   **express-validator** (Middleware pour la validation des données des requêtes)

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine de développement :

*   **Node.js** (version 18 ou supérieure recommandée)
*   **npm** (Node Package Manager, généralement inclus avec Node.js)
*   **MongoDB Community Server** (doit être en cours d'exécution localement)
*   **(Optionnel) MongoDB Compass** (pour visualiser la base de données)

## Installation

Suivez ces étapes pour configurer et lancer le projet backend :

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/votre-utilisateur/formulaire_contact_backend.git
    cd formulaire_contact_backend
    ```

2.  **Installez les dépendances npm :**
   ```bash
   npm install
   ```

## Configuration des Variables d'Environnement

Le projet utilise des variables d'environnement pour gérer les configurations sensibles.

1.  Créez un fichier nommé `.env` à la racine du projet (au même niveau que `package.json`).
2.  Ajoutez la ligne suivante dans le fichier `.env`, en spécifiant l'URI de votre base de données MongoDB :

```bash
DB_URI=mongodb://localhost:27017/contact_form_db
```

## Démarrage du Serveur

Pour lancer le serveur Express :

```bash
node index.js
```

Le serveur démarrera sur http://localhost:3000. Vous devriez voir un message de confirmation de connexion à MongoDB et de démarrage du serveur dans votre console.

## Endpoints de l'API

L'API expose les endpoints suivants pour interagir avec les messages de contact :

* GET /
Description : Endpoint racine de l'API.
Réponse : Un message JSON de bienvenue indiquant que l'API est opérationnelle.
Exemple de Réponse :

```bash
{ "message": "Bienvenue sur l'API de formulaire de contact ! Accédez à /messages pour les messages ou /submit-form pour soumettre." }
```

* POST /submit-form
Description : Soumet un nouveau message de contact.
Méthode : POST
Headers : Content-Type: application/json
Corps de la Requête (JSON) :

```bash
{
  "nom": "Votre Nom",
  "email": "votre.email@example.com",
  "message": "Votre message ici."
}
```

Réponses possibles :
200 OK : Message envoyé avec succès ! (si la validation et l'enregistrement sont réussis)
400 Bad Request : { "errors": [ { "msg": "Le nom est obligatoire." }, ... ] } (si la validation des données échoue)
500 Internal Server Error : Une erreur est survenue lors de l'envoi du message. (en cas d'erreur serveur inattendue)

* GET /messages
Description : Récupère tous les messages de contact enregistrés.
Méthode : GET
Réponse : Un tableau JSON de tous les messages de contact.
Exemple de Réponse :

```bash
[
  {
    "_id": "60e...",
    "nom": "Alice Dupont",
    "email": "alice.dupont@example.com",
    "message": "Bonjour, j'aimerais en savoir plus.",
    "date": "2025-08-26T...",
    "__v": 0
  }
]
```

##Frontend Correspondant
Cette API est conçue pour être consommée par une application frontend développée avec React.js. Vous pouvez trouver le code source du frontend dans le dépôt suivant :
https://github.com/MChaker01/formulaire-contact-frontend.git
