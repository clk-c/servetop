const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestIp = require('request-ip'); // Assure-toi d'installer la bibliothèque request-ip
const cookieParser = require('cookie-parser'); // Installe cette bibliothèque pour la gestion des cookies
const app = express();


// Middleware pour gérer les erreurs CORS
app.use(cors());

// Middleware pour gérer les cookies
app.use(cookieParser());

// Middleware pour analyser les requêtes JSON avec une taille de payload plus grande
app.use(bodyParser.json({ limit: '50mb' }));  // Pour les requêtes JSON
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));  // Pour les requêtes URL-encodées

// Base de données simulée
let applications = [];
let trends = [];

// Route POST pour ajouter une application
app.post('/admin/applications', (req, res) => {
    const { name, description, image } = req.body;
    if (!name || !description || !image) {
        return res.status(400).send("Tous les champs sont obligatoires.");
    }
    const newApp = { id: Date.now(), name, description, image };
    applications.push(newApp);
    res.json(newApp);  // Répondre avec l'application ajoutée
});

// Route GET pour récupérer les applications
app.get('/admin/applications', (req, res) => {
    res.json(applications);  // Renvoie la liste des applications
});

// Simuler une base de données pour les propositions d'applications
let appProposals = [];

// Route pour recevoir une nouvelle proposition d'application
app.post("/admin/propose", (req, res) => {
    const { name, description, features, email, appointmentDate, status } = req.body;
    if (!name || !description || !features || !email || !appointmentDate || !status) {
        return res.status(400).send("Tous les champs sont obligatoires.");
    }
    const newProposal = {
        id: appProposals.length + 1,
        name,
        description,
        features,
        email,
        appointmentDate,
        status
    };

    // Ajouter la nouvelle proposition à la base de données
    appProposals.push(newProposal);

    res.status(201).send("Proposition reçue");
});

// Route pour récupérer toutes les propositions dans la partie admin
app.get("/admin/propose", (req, res) => {
    res.json(appProposals);
});

// Exemple de route pour supprimer une proposition
app.delete("/admin/proposals/delete/:id", (req, res) => {
    const { id } = req.params;
    const proposalIndex = appProposals.findIndex(p => p.id === parseInt(id));
    
    if (proposalIndex !== -1) {
        appProposals.splice(proposalIndex, 1); // Supprimer la proposition
        res.status(200).send("Proposition supprimée avec succès");
    } else {
        res.status(404).send("Proposition non trouvée");
    }
});

let appointments = []; // Stockage temporaire des rendez-vous (à remplacer par une base de données)

app.use(express.json());

// Route pour enregistrer un rendez-vous
app.post("/admin/appointments", (req, res) => {
    const { fullName, email, phone, appointmentDate, message } = req.body;

    if (!fullName || !email || !phone || !appointmentDate) {
        return res.status(400).send("Tous les champs obligatoires doivent être remplis.");
    }

    const newAppointment = {
        id: appointments.length + 1,
        fullName,
        email,
        phone,
        appointmentDate,
        message,
    };

    appointments.push(newAppointment);
    res.status(201).send("Rendez-vous enregistré avec succès !");
});

// Route pour récupérer les rendez-vous (pour la partie admin)
app.get("/admin/appointments", (req, res) => {
    res.status(200).json(appointments);
});

// Route pour supprimer un rendez-vous (pour la partie admin)
app.delete("/admin/appointments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = appointments.findIndex(appointment => appointment.id === id);

    if (index !== -1) {
        appointments.splice(index, 1);
        res.status(200).send("Rendez-vous supprimé avec succès.");
    } else {
        res.status(404).send("Rendez-vous introuvable.");
    }
});

// Liste des utilisateurs actifs avec leurs informations
let activeUsers = [];

// Middleware pour récupérer l'IP et le User-Agent de l'utilisateur
app.use(requestIp.mw());
app.use((req, res, next) => {
    const userIp = req.clientIp;
    const userAgent = req.get('User-Agent');
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
        activeUsers.push({
            sessionId,
            ip: userIp,
            userAgent: userAgent,
            timestamp: new Date().toISOString()
        });
    }
    next();
});

// Route pour afficher les utilisateurs actifs avec leurs informations
app.get('/admin/active-users', (req, res) => {
    res.json({ activeUsers });
});

const nodemailer = require('nodemailer');

// Configuration du transporteur nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'alhassansidibe83@gmail.com', 
        pass: 'tqiw mweo kliz amvi' 
    }
});



// Route pour envoyer un email
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    console.log('Données reçues:', { name, email, message }); // Log les données reçues

    const mailOptions = {
        from: email,
        to: 'alhassansidibe83@gmail.com', // Ton adresse email où les messages seront envoyés
        subject: `Message de ${name} via le formulaire de contact`,
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur d\'envoi de l\'email:', error); // Log l'erreur
            return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error });
        }
        console.log('Email envoyé:', info.response); // Log le succès
        res.status(200).json({ message: 'Message envoyé avec succès !' });
    });
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
