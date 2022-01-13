const Role = require('../models/role');
const User = require('../models/user');

const isRoleValid = async(role = '')=>{
    const existsRole = await Role.findOne({role});
    if(!existsRole) throw new Error(`Role ${role} is not registered in DB`);
}
const emailExists = async(mail = '')=>{
//verified if mail exist
	const existsEmail = await User.findOne({mail});
  if(existsEmail) throw new Error(`Email ${mail} already exists in DB or is empty`);
};
const existsUserById = async(id)=>{
//verified if mail exist
	const existsUser = await User.findOne({id});
  if(!existsUser) throw new Error(`id: ${id} do not exists`);
};

module.exports = {
  isRoleValid,
  emailExists,
  existsUserById
}