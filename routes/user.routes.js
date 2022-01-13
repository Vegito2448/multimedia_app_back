const {Router}= require('express');
const { check } = require('express-validator');



const {validateFields}= require('../middlewares/validate-fields');
const { isRoleValid,emailExists, existsUserById } = require('../helpers/db-validators');

const { usersGet, 
        usersDelete, 
        usersPut,
        usersPatch, 
        usersPost } = require('../controllers/users.controller');

const router = Router();

   router.get('/',usersGet );

    router.put('/:id',[
        check('id','is not a valid ID').isMongoId(),
        check('id').custom(existsUserById),
        check('role').custom(isRoleValid),
        validateFields
    ],usersPut);

    router.post('/',[
        check('name','name is mandatory').not().isEmpty(),
        check('password','password is mandatory and more 6 charaters').isLength({min:6}),
        // check('role','Is not a valid role').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('mail','Email is not valid ').isEmail(),
        check('mail').custom(emailExists),
        check('role',).custom(isRoleValid),
        validateFields
    ],usersPost);

    router.delete('/:id',[
        check('id','is not a valid ID').isMongoId(),
        check('id').custom(existsUserById),
        validateFields
    ],usersDelete);

    router.patch('/',usersPatch);


module.exports= router;