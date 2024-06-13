const validatePassword = (req, res, next)=> {

    const {password} = req.body

    // Expression régulière pour imposer les exigences du mot de passe
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/

    // Tester le mot de passe avec l'expression régulière
    if(!regex.test(password)){
        // Si le mot de passe ne correspond pas à l'expression régulière, envoyer une réponse 400 Bad Request avec un message d'erreur
        return res.status(400).send('Mot de passe invalide, vous devez avoir au minimum 12 caractères contenant une minuscule, une majuscule, un chiffre, et un caractères spécial')
    }
    // Si le mot de passe correspond à l'expression régulière, appeler la fonction middleware suivante dans la pile
    next()    
}

module.exports = validatePassword