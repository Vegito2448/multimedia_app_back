const {Schema,model} = require('mongoose');
const UserSchema = Schema({
  name:{
    type:String,
    required:[true,'name is mandatory']
  },
  mail:{
    type:String,
    required:[true,'mail is mandatory'],
    unique:true
  },
  password:{
    type:String,
    required:[true,'password is mandatory']
  },
  image:{
    type:String
  },
  role:{
    type:String,
    required:true,
    emun:['ADMIN_ROLE', 'USER_ROLE']
  },
  status:{
    type:Boolean,
    default:true
  },
  google:{
    type:Boolean,
    default:false
  }
});

UserSchema.methods.toJSON = function(){
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id
  return user;
}

module.exports = model('User',UserSchema);