const User = require('../models/UserModel')
const Helper = require('../helpers/Helper')
const express = require('express')
const router = express.Router()
const Middlewares = require('../middlewares/Middlewares')
const {
	serverError,
	createErrorWithObject,
	ERROR,
} = require('../helpers/errorHelper')
const TicketType = require('../models/TicketTypeModel')
const Role = require('../models/RoleModel')
const { hash } = require('../helpers/Helper')

const mongoose = require('mongoose')


// const test = async () => {
//    await Role.create({name:"admin"}).then(async role => {
// 			const hash = await Helper.hash.generateHash('aifactory')
// 				await User.create({
// 					roleIds:[role._id],
// 					name: 'AI Factory',
// 					surname: 'Tech',
// 					email: 'admin@aifactory.tech',
// 					password: hash,
// 				})
// 					.then(() => {})
// 					.catch(e => console.log(e))
//    }).catch(e => next(serverError(e)))
	
// 			}
// test()

//authorizedRoleIds size = 1 hatası giderir.
/*const denemefunc = async () => {
	let Aid = new  mongoose.Types.ObjectId() 
	Role.findOne({name:"admin"})
		.then(agent => {
			Aid=agent._id
		})
		.catch(e => next(serverError(e)))

		TicketType.findOneAndUpdate(
			{authorizedRoleIds: {$size:1}},
			{ $push: { authorizedRoleIds: mongoose.Types.ObjectId("5feae7d5ced7b0897b11ce90") } }
		).then(ticketType => {
			console.log("1")
		})
		.catch(e => next(serverError(e)))
}
denemefunc()*/

router.post('/login', Middlewares.login, (req, res, next) => {
	const { user } = res.locals
	console.log(user)
	Helper.user
		.generateToken(user)
		.then(token => {
			res.send({ user, token })
		})
		.catch(err => next(serverError(err)))
})

router.put('/updateRole', Middlewares.isAdmin, (req, res, next) => {
	const { roleIds } = req.body
	const { _id } = res.locals.decoded
	const userIp = req.headers['x-forwarded-for']
	User.findOneAndUpdate(
		{ _id },
		{ roleIds, modifiedIp: userIp ? userIp : 'unknown' },
		{ new: true },
	)
		.then(user => {
			res.send(user)
		})
		.catch(e => next(serverError(e)))
})

router.post('/', Middlewares.createUser, async (req, res, next) => {
	const { password, email, roleIds, name, surname } = req.body
	const hash = await Helper.hash.generateHash(password)
	User.create({
		password: hash,
		email,
		name: name.trim(),
		surname: surname.trim(),
		roleIds,
	})
		.then(user => {
			res.send({ ...user.toObject(), userMessageCount: 0 })
		})
		.catch(e => next(serverError(e)))
})

router.get('/', Middlewares.verifyToken, (req, res, next) => {
	const { _id } = res.locals.decoded
	User.findOne({ _id })
		.populate('roles')
		.then(user => {
			res.send(user)
		})
		.catch(e => next(serverError(e)))
})

router.get('/list', Middlewares.verifyToken, (req, res, next) => {
	const { _id } = res.locals.decoded
	User.find({})
		.populate('roles')
		.populate('userMessageCount')
		.then(users => {
			res.send(users)
		})
		.catch(e => next(serverError(e)))
})

router.put('/delete/:userId', Middlewares.deleteUser, (req, res, next) => {
	const { userId } = req.params
	const userIp = req.headers['x-forwarded-for']
	User.findOneAndUpdate(
		{ _id: userId },
		{ deleted: true, modifiedIp: userIp ? userIp : 'unknown' },
	)
		.then(user => {
			res.sendStatus(200)
		})
		.catch(e => next(serverError(e)))
})

router.get('/settings', Middlewares.verifyToken, (req, res, next) => {
	Promise.all([Role.find(), TicketType.find()])
		.then(result => {
			res.send({ roles: result[0], ticketTypes: result[1] })
		})
		.catch(e => next(serverError(e)))
})

router.put('/changePassword', Middlewares.changePassword, (req, res, next) => {
	const { user } = res.locals
	const { oldPassword, newPassword } = req.body
	const userIp = req.headers['x-forwarded-for']
	if (oldPassword === newPassword) next(createErrorWithObject(ERROR.SAME_PASSWORD))
	else {
		Helper.hash
			.generateHash(newPassword)
			.then(hash => {
				User.findByIdAndUpdate(
					user._id,
					{ $set: { password: hash, modifiedIp: userIp ? userIp : 'unknown' } },
					{ new: true },
				)
					.then(updatedUser => {
						Helper.user
							.generateToken(user)
							.then(token => res.send({ user: updatedUser, token }))
							.catch(err => next(serverError(err)))
					})
					.catch(err => next(serverError(err)))
			})
			.catch(err => next(serverError(err)))
	}
})

router.get('/findByRole/:roleId', (req, res, next) => {
	const { roleId } = req.params
	const roleIds = req.body.roleIds
	let emails = []
	Helper.user
		.findUserByRole(roleIds)
		.then(users => {
			emails = Helper.user.getUserEmail(users)
			res.send(emails)
		})
		.catch(e => next(serverError(e)))
})

router.put('/updateUserProfile/:userId',
	Middlewares.updateUser,
	async (req, res, next) => {
		const userIp = req.headers['x-forwarded-for']
		const { userId } = req.params
		const { email, name, surname, password, roleIds } = req.body
		const updateObject = {
			email,
			name,
			surname,
			modifiedIp: userIp ? userIp : 'unknown',
			roleIds,
		}
		if (password && password !== '') {
			const hash = await Helper.hash.generateHash(password)
			updateObject.password = hash
		}
		User.findOneAndUpdate({ _id: userId }, updateObject, { new: true })
			.populate('roles')
			.populate('userMessageCount')
			.then(user => {
				res.send(user)
			})
			.catch(e => next(serverError(e)))
	},
)

router.put('/deleteUser/:userId',(req, res, next) => {

	const { userId } = req.params
	
	User.findOneAndDelete({ _id: userId },(err,deletedUser)=>{
		if(!err){
			console.log(deletedUser)
		}
	}).then(user => {
		res.send(user)
	})
	.catch(e => next(serverError(e)))
	
})

module.exports = router
