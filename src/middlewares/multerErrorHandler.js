const multer = require("multer")
const upload = require("../middlewares/multer-config")

//Middleware pour gérer les erreurs de multer
const multerErrorHandler = (req, res, next) => {
    // Appel de la fonction upload pour gérer le téléchargement de fichiers
    upload(req, res, function(err) {
        // Si une erreur spécifique à multer se produit
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                // Erreur si la taille du fichier dépasse la limite
                return res.status(400).json({ message: 'La taille du fichier est trop grande.' })
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                // Erreur si le type de fichier n'est pas autorisé
                return res.status(400).json({ message: 'Type de fichier non autorisé.' })
            }
            // Autres erreurs liées à multer
            return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier.' })
        } else if (err) {
            // Si une autre erreur se produit
            return res.status(500).json({ message: 'Erreur du serveur.' })
        }
        // Passe au middleware suivant si tout va bien
        next() 
    })
}

module.exports = multerErrorHandler;