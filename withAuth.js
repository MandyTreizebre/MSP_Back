const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const withAuth = (req, res, next)=> {
    console.log("Headers :", req.headers)
    const token = req.headers['x-access-token']

    if(token === undefined){
        res.json({status: 404, msg: "Erreur, token introuvable"})
    } else {
        jwt.verify(token, secret, (err, decoded)=>{
            if(err) {
                if(err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Votre session a expiré. Veuillez vous reconnecter.' });
                }
                return res.status(401).json({ message: 'Erreur de token.' });
            } else {
                req.id = decoded.id
                next()
            }
        })
    }
}

module.exports = withAuth