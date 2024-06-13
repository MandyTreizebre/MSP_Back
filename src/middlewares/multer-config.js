const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg', 
    'image/png': 'png',
}

// Configuration du stockage pour multer
const storage = multer.diskStorage({
    // Définition du dossier de destination pour les fichiers téléchargés
    destination: (req, file, callback) => {
        callback(null, 'public/images')
    },
    // Définition du nom de fichier pour les fichiers téléchargés
    filename: (req, file, callback) => {
        // Remplacer les espaces par des underscores et retirer l'extension
        const name = file.originalname.replace(/ /g, '_' ).split('.')[0]
        // Supprimer les caractères non alphanumériques (sauf _ et -)
        const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '')
        // Obtenir l'extension du fichier à partir de son type MIME
        const extension = MIME_TYPES[file.mimetype]

        // Vérification si le type MIME est supporté
        if (!MIME_TYPES[file.mimetype]) {
            // Si le type MIME n'est pas supporté, retourner une erreur
            return callback(new Error('Type de fichier non autorisé.'), false);
        }

        // Générer le nom final du fichier avec un timestamp pour le rendre unique
        callback(null, `${sanitizedName}_${Date.now()}.${extension}`)
    }
})

// Générer le nom final du fichier avec un timestamp pour le rendre unique
const upload = multer({
    storage: storage, // Utiliser la configuration de stockage définie ci-dessus
    limits: {
        fileSize: 1024 * 1024 * 5 // Taille maximale du fichier : 5 Mo
    },
    fileFilter: (req, file, callback) => {
        // Vérifier si le type MIME est supporté
        if (MIME_TYPES[file.mimetype]) {
            callback(null, true) // Accepter le fichier
        } else {
            callback(new Error('Type de fichier non autorisé.'), false) // Rejeter le fichier avec une erreur
        }
    }
}).single('picture') //'picture' correspond au nom du champ dans les formulaires.

module.exports = upload