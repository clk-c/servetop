const express = require('express');
const router = express.Router();


// Validation des données
function validateApplicationData(data) {
    const { name, description, image } = data;
    return name && description && image; // Vous pouvez ajouter des validations supplémentaires ici
}

function validateTrendData(data) {
    const { name, description, image } = data;
    return name && description && image; // Vous pouvez ajouter des validations supplémentaires ici
}

// Ajouter une application
router.post('/admin/applications', (req, res) => {
    const { name, description, image } = req.body;

    // Validation des données
    if (!validateApplicationData(req.body)) {
        return res.status(400).json({ message: 'Données invalides pour l\'application.' });
    }

    applications.push({ name, description, image });
    res.status(201).json({ message: 'Application ajoutée avec succès' });
});

// Récupérer les applications
router.get('/admin/applications', (req, res) => {
    res.json(applications);
});

// Route pour afficher les propositions dans l'admin
app.get("/admin/propose", (req, res) => {
    res.json(appProposals);
});

let appointments = []; // Stockage temporaire des rendez-vous

// Route pour récupérer tous les rendez-vous
router.get("/appointments", (req, res) => {
    res.json(appointments);
});

// Route pour supprimer un rendez-vous par ID
router.delete("/appointments/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = appointments.findIndex(app => app.id === id);

    if (index !== -1) {
        appointments.splice(index, 1); // Supprimer le rendez-vous
        res.status(200).send("Rendez-vous supprimé avec succès !");
    } else {
        res.status(404).send("Rendez-vous non trouvé.");
    }
});

// Supposons que tu utilises une base de données ou une session pour gérer les utilisateurs actifs.
let activeUsers = []; // Remplace ceci par ta méthode de gestion des utilisateurs actifs (base de données, sessions, etc.)

// Route pour récupérer les utilisateurs actifs
router.get('/active-users', (req, res) => {
    // Envoie la liste des utilisateurs actifs
    res.json({ activeUsers });
});

// Route pour supprimer un utilisateur actif
router.delete('/active-users/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;

    // Trouver l'utilisateur correspondant à sessionId et le supprimer
    activeUsers = activeUsers.filter(user => user.sessionId !== sessionId);

    res.status(200).send('Utilisateur supprimé avec succès.');
});

module.exports = router;
// Stockage temporaire des données
const applications = [];
const trends = [];

// Exporter les données
module.exports = {
    applications,
    trends
};
