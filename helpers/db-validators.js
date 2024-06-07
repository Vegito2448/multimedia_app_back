const { Category, Role, User, Content, Topic, Type } = require("../models");

const isRoleValid = async (role = "") => {
  const existsRole = await Role.findOne({ role });

  if (!existsRole) throw new Error(`Role ${role} is not registered in DB`);
};
const emailExists = async (mail = "") => {
  //verified if mail exist
  const existsEmail = await User.findOne({ mail });
  if (existsEmail)
    throw new Error(`Email ${mail} already exists in DB or is empty`);
};
const existsUserById = async (_id) => {
  //verified if  UserById exist
  const existsUser = await User.findOne({ _id });
  if (!existsUser) throw new Error(`id: ${_id} do not exists or is not Valid`);
};

const existsCategory = async (_id) => {
  //verified if Category exist
  const existsCat = await Category.findOne({ _id });
  if (!existsCat) throw new Error(`id: ${_id} do not exists or is not Valid`);
};
const existsContent = async (_id) => {
  //verified if  Content exist
  const existsContent = await Content.findOne({ _id });
  if (!existsContent)
    throw new Error(`id: ${_id} do not exists or is not Valid`);
};

const existsTopic = async (_id) => {
  //verified if  Topic exist
  const existsTopic = await Topic.findOne({ _id });
  if (!existsTopic) throw new Error(`id: ${_id} do not exists or is not Valid`);
};

const existsType = async (_id) => {
  //verified if Type exist
  const existsType = await Type.findOne({ _id });
  if (!existsType) throw new Error(`id: ${_id} do not exists or is not Valid`);
};

const isANumber = async (number) => {
  if (isNaN(number) && !Number.isInteger())
    throw new Error(`Number: ${number} provider is not valid`);
};

/*
 *validate Allowed Collections
 */
const allowedCollections = (collection = "", collections = []) => {
  const include = collections.includes(collection);
  if (!include)
    throw new Error(
      `the collection: ${collection} isn't allowed, allowed collections: ${collections}`
    );
  return true;
};

module.exports = {
  allowedCollections,
  isRoleValid,
  emailExists,
  existsUserById,
  isANumber,
  existsCategory,
  existsContent,
  existsTopic,
  existsType,
};
