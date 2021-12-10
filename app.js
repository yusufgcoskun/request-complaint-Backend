const express = require('express')
const logger = require('morgan')
const app = express()
const cors = require('cors')
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
	cors: {
		origin: '*',
	},
	path: '/api/socket',
})

app.use(
	cors({
		origin: [
			'*',
			'http://localhost:3000',
			'http://localhost:8888',
			'https://mezitli.bel.tr',
			'http://localhost:3002',
		],
		optionsSuccessStatus: 200,
	}),
)

const config = require('./constants/config')
app.set('API_SECRET_KEY', config.API_SECRET_KEY)
app.set('DB_URL', config.DB_URL)
const db = require('./db/connection')(app)

io.on('connection', socket => {
	console.log('Socket connected')
	socket.on('disconnect', () => {
		console.log('socket disconnect')
	})
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public/attachments'))

const userRouter = require('./routes/userRouter')
const ticketRouter = require('./routes/ticketRouter')
const messageRouter = require('./routes/messageRouter')
const ticketTypeRouter = require('./routes//ticketTypeRouter')
const roleRouter = require('./routes/roleRouter')
const attachmentRouter = require('./routes/attachmentRouter')

app.use('/api/user', userRouter)
app.use('/api/ticket', ticketRouter).set('socketIo', io)
app.use('/api/message', messageRouter)
app.use('/api/ticketType', ticketTypeRouter)
app.use('/api/role', roleRouter)
app.use('/api/attachment', attachmentRouter)
app.use('/api/static', express.static('public/attachments'))

const { handleError } = require('./middlewares/errorMiddlewares')
const TicketModel = require('./models/TicketModel')
const { TICKET_PURPOSE } = require('./constants/constants')
app.use(handleError)

// TicketModel.updateMany(
 //	{},
 //	{ assignmentAndStatusInformations: [], purpose: TICKET_PURPOSE.PROPOSAL },
// ).exec()

const port = process.env.PORT || 8081
http.listen(port, err => {
	if (err) throw err
	console.log(`listening ${port}`)
})
