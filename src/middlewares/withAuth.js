const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
//Obtain the JWT secret from the environment variables
const secret = process.env.JWT_SECRET

const withAuth = (req, res, next)=> {

    //Extract the token from cookies
    const token = req.cookies['token']

    //Check if the token is undefined
    if(token === undefined){
        res.status(404).json({ msg: "Erreur, token introuvable, veuillez vous connecter"})
    } else {
        //If the token is defined, verify it using the jwt.verify method
        jwt.verify(token, secret, (err, decoded)=>{
            //If there's an error in verification, respond with a 401 status and an error message
            if(err) {
                res.status(401).json({ msg: 'token invalide' })
            } else {
                //If the token is valid, extract the decoded id and assign it to req.id
                req.id = decoded.id
                req.token = token

                next()
            }
        })
    }
}

module.exports = withAuth