const multer = require("multer")
const upload = require("../back/multer-config")

const multerErrorHandler = (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // Erreurs spécifiques à Multer
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'La taille du fichier est trop grande.' });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ message: 'Type de fichier non autorisé.' });
            }
            return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier.' });
        } else if (err) {
            // Autres erreurs
            return res.status(500).json({ message: 'Erreur du serveur.' });
        }
        next(); // Passez à la prochaine middleware si aucun problème
    });
};

module.exports = multerErrorHandler;