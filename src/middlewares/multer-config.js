const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg', 
    'image/png': 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.replace(/ /g, '_' ).split('.')[0]
        const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '')
        const extension = MIME_TYPES[file.mimetype]

        // Correction ici : vérifiez si le type MIME est une clé dans MIME_TYPES
        if (!MIME_TYPES[file.mimetype]) {
            // Si le type MIME n'est pas supporté, vous pouvez appeler callback avec une erreur.
            return callback(new Error('Type de fichier non autorisé.'), false);
        }

        callback(null, `${sanitizedName}_${Date.now()}.${extension}`)
    }
})

// Configurer les limites et spécifier le champ attendu pour le fichier
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB max file size
    },
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES[file.mimetype]) {
            callback(null, true);
        } else {
            callback(new Error('Type de fichier non autorisé.'), false);
        }
    }
}).single('picture') // Assurez-vous que 'picture' correspond au nom du champ dans votre formulaire.

module.exports = upload