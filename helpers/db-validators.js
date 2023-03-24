const { Category, Role, User, Product } = require('../models');

const isRoleValid = async(role = '')=>{
    const existsRole = await Role.findOne({role});
    if(!existsRole) throw new Error(`Role ${role} is not registered in DB`);
}
const emailExists = async(mail = '')=>{
//verified if mail exist
	const existsEmail = await User.findOne({mail});
  if(existsEmail) throw new Error(`Email ${mail} already exists in DB or is empty`);
};
const existsUserById = async (_id) => {
  console.log("🚀 ~ file: db-validators.js:14 ~ existsUserById ~ id", _id)

//verified if mail exist
  const existsUser = await User.findOne({ _id });
  if (!existsUser) throw new Error(`id: ${_id} do not exists or is not Valid`);
};

const existsCategory = async (_id) => {
  console.log("🚀 ~ file: db-validators.js:22 ~ existsCategory ~ _id:", _id);

  //verified if mail exist
  const existsCat = await Category.findOne({ _id });
  if (!existsCat) throw new Error(`id: ${_id} do not exists or is not Valid`);
};
const existsProduct = async (_id) => {
  console.log("🚀 ~ file: db-validators.js:22 ~ existsCategory ~ _id:", _id);

  //verified if mail exist
  const modelFound = await Product.findOne({ _id });
  if (!modelFound) throw new Error(`id: ${_id} do not exists in the Data of: ${modelName} or is not Valid`);
};

const isANumber = async (number) => {
  if (isNaN(number) && !Number.isInteger()) throw new Error(`Number: ${number} provider is not valid`);
}

module.exports = {
  isRoleValid,
  emailExists,
  existsUserById,
  isANumber,
  existsCategory,
  existsProduct
}