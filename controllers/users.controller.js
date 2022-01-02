const {response} = require('express')

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
const usersPost =(req,res)=>{
      const {name , age} = req.body;

      res.status(201).json({
          msg:'post API - Controller',
          name, age
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