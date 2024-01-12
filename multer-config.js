const multer = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg', 
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images')
    },
    filename: (req, file, callback) => {
        let name = file.originalname.split(' ').join('_').split('.')[0]
        name = name.replace(/[^a-zA-Z0-9_-]/g, '')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, `${name}_${Date.now()}.${extension}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
}).single('picture')

module.exports = upload

module.exports = multer({ storage: storage }).single('picture')
