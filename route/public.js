const express = require('express');
const router = express.Router();

// Importer les données de l'admin
const adminData = require('./admin');

// Récupérer les applications et tendances pour la partie publique
router.get('/data', (req, res) => {
    res.json({
        applications: adminData.applications,
        
    });
});

module.exports = router;
