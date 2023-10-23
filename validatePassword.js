const validatePassword = (req, res, next)=> {
    /*Destructure the password property from req.body*/
    const {password} = req.body
    /*Define a regular expression to enforce password requirements*/
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    /*Test the password against the regex*/
    if(!regex.test(password)){
        /*If the password doesn't match the regex, send a 400 Bad Request response with an error message*/
        return res.status(400).send('Mot de passe invalide, vous devez avoir au moinimum 8 caractères contenant une minuscule, une majuscule, un chiffre, et un caractères spécial')
    }
    /*If the password matches the regex, call the next middleware function in the stack*/
    next()    
}

/*Export the validatePassword middleware function as a module*/
module.exports = validatePassword