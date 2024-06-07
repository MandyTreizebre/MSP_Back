//Export function to initialize DAL with database connection
module.exports = (_db) => {
    db = _db //Assign database connection to a global variable db
    return ProfessionalsDAL
}

class ProfessionalsDAL {
    //Get all professionals along with their planning and day informations from the database
    static getProfessionalsAndHours(){
        return db.query('SELECT DISTINCT professionals.id, professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.details, professionals.speciality_id, professionals.isActive, d.day_name AS day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning  ON professionals.id = planning.pro_id JOIN days d on planning.day_id = d.id')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Get all professionals
    static getProfessionals(){
        return db.query('SELECT id, lastname, firstname, address, zip, city, phone, details, speciality_id FROM professionals')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Get professional details by ID
    static GetProfessionalById(id){
        return db.query('SELECT lastname, firstname, address, zip, city, phone, details, speciality_id FROM professionals  WHERE id = ?',[id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Add a new professional to the database
    static addProfessional(req){
        let defaultImage = "default-image-professional.png"

        return db.query('INSERT INTO professionals (lastname, firstname, address, zip, city, phone, details, speciality_id, picture)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.lastname, req.body.firstname, req.body.address, req.body.zip, req.body.city, req.body.phone, req.body.details, req.body.speciality_id, defaultImage])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    // Update an existing professional in the database
    static updateProfessional(req, id){
        return db.query('UPDATE professionals SET lastname= ?, firstname= ?, address=?, zip= ?, city= ?, phone= ?, details= ?, speciality_id= ? WHERE id= ?',
        [req.body.lastname, req.body.firstname, req.body.address, req.body.zip, req.body.city, req.body.phone, req.body.details, req.body.speciality_id, id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Toggle a professional's active status
    static changeStatusProfessional(id){
        return db.query('UPDATE professionals SET isActive = NOT isActive WHERE id = ?', [id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //Get professionals by their speciality ID
    static getProBySpe(speciality_id){
        return db.query('SELECT DISTINCT professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.details,professionals.picture, d.day_name AS day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning  ON professionals.id = planning.pro_id JOIN days d on planning.day_id = d.id WHERE professionals.speciality_id = ? AND professionals.isActive = 1', [speciality_id])
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //get all specializations from the database
    static getSpecializations(){
        return db.query('SELECT id, name_spe, picture, key_url FROM specializations')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }

    //get professionals with JOIN operations on the planning, specializations, and days tables, filtered by specialization names and active status of professionals
    static getProfessionalsGuards(){
        return db.query('SELECT professionals.id, professionals.lastname, professionals.firstname, professionals.address, professionals.zip, professionals.city, professionals.phone, professionals.isActive, professionals.picture, specializations.name_spe, days.day_name, planning.h_start_morning, planning.h_end_morning, planning.h_start_afternoon, planning.h_end_afternoon FROM professionals JOIN planning ON professionals.id= planning.pro_id JOIN specializations ON professionals.speciality_id =  specializations.id JOIN days ON planning.day_id = days.id WHERE specializations.name_spe IN ("Médecins", "Dentistes", "Pharmacies") AND professionals.isActive = 1  ORDER BY professionals.lastname, professionals.firstname, days.id')
        .then((res)=>{
            return res
        })
        .catch((err)=>{
            return err
        })
    }
}


