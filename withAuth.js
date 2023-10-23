const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
/*Obtain the JWT secret from the environment variables*/
const secret = process.env.JWT_SECRET

const withAuth = (req, res, next)=> {
    console.log("passe par withAuth")
    /*Extract the token from cookies*/
    const token = req.cookies['token']

    /*Check if the token is undefined*/
    if(token === undefined){
        /* If the token is undefined, respond with a 404 status and an error message*/
        res.json({status: 404, msg: "Erreur, token introuvable, veuillez vous connecter"})
    } else {
        /*If the token is defined, verify it using the jwt.verify method*/
        jwt.verify(token, secret, (err, decoded)=>{
            /*If there's an error in verification, respond with a 401 status and an error message*/
            if(err) {
                res.json({status: 401,  msg: 'token invalide' })
            } else {
                /*If the token is valid, extract the decoded id and assign it to req.id*/
                req.id = decoded.id
                req.token = token
                console.log("Decoded ID:", decoded.id)
                console.log("Decoded TOKEN:", token)
                /*Call the next middleware function in the stack*/
                next()
            }
        })
    }
}

/*Export the withAuth middleware function as a module*/
module.exports = withAuth