const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const secret = process.env.JWT_SECRET

const withAuth = (req, res, next)=> {

    //Extrait le token des cookies
    const token = req.cookies['token']

    // Vérifie si le token est indéfini
    if (token === undefined){
        res.status(404).json({ msg: "Erreur, token introuvable, veuillez vous connecter" })
    } else {
        // Si le token est défini, le vérifier en utilisant la méthode jwt.verify
        jwt.verify(token, secret, (err, decoded)=>{
            // Si une erreur survient lors de la vérification 
            if(err) {
                res.status(401).json({ msg: 'token invalide' })
            } else {
                // Si le token est valide, extraire l'id décodé et l'assigner à req.id
                req.id = decoded.id
                req.token = token
                
                // Passe au middleware suivant si tout est ok
                next()
            }
        })
    }
}

module.exports = withAuth