const multer = require("multer")
const upload = require("../middlewares/multer-config")

const multerErrorHandler = (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // specific error multer
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'La taille du fichier est trop grande.' })
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ message: 'Type de fichier non autorisé.' })
            }
            return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier.' })
        } else if (err) {
            // other errors
            return res.status(500).json({ message: 'Erreur du serveur.' })
        }

        console.log('req.body:', req.body)
        console.log('req.file:', req.file)

        next() 
    })
}

module.exports = multerErrorHandler;