const {Router}= require('express');
const { usersGet, 
        usersDelete, 
        usersPut,
        usersPatch, 
        usersPost } = require('../controllers/users.controller');

const router = Router();

   router.get('/',usersGet );

    router.put('/:id',usersPut);

    router.post('/',usersPost);

    router.delete('/',usersDelete);

    router.patch('/',usersPatch);


module.exports= router;