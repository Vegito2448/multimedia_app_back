const {response} = require('express');

const User = require('../models/user');

const usersGet= (req= request,res = response)=>{
  const {q,name=`No name`,apikey, page , limit} = req.query;
       res.json({
         msg:'get API - Controlller',
         q,
         name,
         apikey,
         page,
         limit
       })
    }
const usersPost =async (req,res)=>{
      const body = req.body;
      const user = new User( body );
      
      await user.save();
      
      res.json({
          msg:'post API - Controller',
          user
      })
    };
const usersPut = (req,res)=>{
  const id = req.params.id;
       res.json({
         msg:'put API - Controller',
         id
       })
    };
const usersPatch = (req,res)=>{
       res.json({
         msg:'patch API - Controller'
       })
    };
const usersDelete = (req,res)=>{
       res.json({
         msg:'delete API - Controller'
       })
    };


module.exports = {
  usersGet, 
  usersPost,
  usersPut,
  usersPatch,
  usersDelete
}