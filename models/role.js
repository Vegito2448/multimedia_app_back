const {Schema,model} = require('mongoose');

const {} = require('mongoose');

const RoleSchema = Schema({
  role:{
    type:String,
    required:[true,'role is mandatory']
  }
})
module.exports = model("Role",RoleSchema);