module.exports = (_db) => {
    db = _db
    return OpeningHoursModel
}

class OpeningHoursModel {

    // Récupération de tous les horaires 
    static getAllHours(){
        return db.query('SELECT * FROM horaires')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Récupération de tous les horaires par professionnel 
    static getHoursByProfessionnal(fk_pro_id){
        return db.query('SELECT * FROM horaires WHERE fk_pro_id = ?', [fk_pro_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Ajout d'un horaire
    static addHours(req){
        return db.query('INSERT INTO horaires (jour, h_debut_matin, h_fin_matin, h_debut_apm, h_fin_apm, fk_pro_id) VALUES (?, ?, ?, ?, ?, ?)', 
        [req.body.jour, req.body.h_debut_matin, req.body.h_fin_matin, req.body.h_debut_apm, req.body.h_fin_apm, req.body.fk_pro_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
    
    // Modification d'un horaire 
    static updateHours(req, id){
        return db.query('UPDATE horaires SET jour= ?, h_debut_matin= ?, h_fin_matin= ?, h_debut_apm= ?, h_fin_apm= ?, fk_pro_id= ?',
        [req.body.jour, req.body.h_debut_matin, req.body.h_fin_matin, req.body.h_debut_apm, req.body.h_fin_apm, req.body.fk_pro_id, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Suppresion d'un horaire 
    static deleteHours(id){
        return db.query('DELETE from horaires WHERE id= ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}