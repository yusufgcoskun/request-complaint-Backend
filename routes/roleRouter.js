const express = require('express')
const router = express.Router()
const Role = require('../models/RoleModel')

const Middlewares = require('../middlewares/Middlewares')
const { serverError } = require('../helpers/errorHelper')


router.post('/', Middlewares.createRole, (req, res, next) => {
	const { name } = req.body
	Role.create({ name })
		.then(role => {
			res.send(role)
		})
		.catch(e => next(serverError(e)))
})

router.get('/', Middlewares.verifyToken, (req, res, next) => {
	Role.find({})
		.then(roles => {
			res.send(roles)
		})
		.catch(e => next(serverError(e)))
})

router.put('/updateRoleNameSettings/:roleId', (req, res, next) => {

	const { roleId } = req.params
	const { name } = req.body
	 Role.findOneAndUpdate({ _id: roleId }, { name }, { new: true })
	 	.then(role => {
	 		res.send(role)
	 	})
	 	.catch(e => next(serverError(e)))
})

router.put('/deleteRole/:roleId',(req, res, next) => {

	const { roleId } = req.params
	
	Role.findOneAndDelete({ _id: roleId },(err,deletedUser)=>{
		if(!err){
			console.log(deletedUser)
		}
	}).then(user => {
		res.send(user)
	})
	.catch(e => next(serverError(e)))
	
})

module.exports = router
