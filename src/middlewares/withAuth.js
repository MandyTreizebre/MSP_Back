const jwt = require('jsonwebtoken') 
const cookieParser = require('cookie-parser') 
const secret = process.env.JWT_SECRET 

const withAuth = (req, res, next) => {
    const token = req.cookies['token'] 

    if (!token) {
        return res.status(401).json({ msg: "Token introuvable, veuillez vous connecter" }) 
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "Token invalide ou expiré" }) 
        } else {
            req.id = decoded.id 
            req.token = token 
            next() 
        }
    }) 
} 

module.exports = withAuth 
