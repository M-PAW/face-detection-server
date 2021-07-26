//const { response } = require('express');

const handleProfileGet = (req, res, db) => {
    const { id } = req.params;
    db
     .select('*').from('users').where({id})
     .then( user => {
         if (user.length){
             res.status(200).json(user[0]);
         } else {
             res.status(400).json('User Not Found')
         }
     })
     .catch(err => res.status(400).json('Error getting user'))
 }

 const handleProfileUpdate = (req, res, db) => {
    const { id } = req.params;
    const { name, age, about } = req.body.formInput;

    db('users')
        .where({ id })
        .update({ name, age, about })
        .then( response => {
            if (response) {
                res.status(201).json('Success')
            } else {
                res.status(400).json('Failure')
            }
        })
        .catch(err => {
            res.status(400).json('Error updating user data')
        })
 }

 module.exports = {
     handleProfileGet,
     handleProfileUpdate
 }