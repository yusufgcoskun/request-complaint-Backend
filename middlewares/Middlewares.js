const userMiddlewares = require('./userMiddlewares')
const validationMiddlewares = require('./validationMiddlewares')
const ticketMiddlewares = require('./ticketMiddlewares')
const ticketTypeMiddlewares = require('../middlewares/ticketTypeMiddlewares')
const roleMiddlewares = require('./roleMiddlewares')
const messageMiddlewares = require('./messageMiddlewares')

const login = [userMiddlewares.verifyPassword]

const createUserMiddleware = [
	userMiddlewares.verifyToken,
	userMiddlewares.checkUserIsAdmin,
	validationMiddlewares.validateEmailInput,
	validationMiddlewares.validateNameInput,
	validationMiddlewares.validateSurnameInput,
	validationMiddlewares.validatePasswordInput,
	validationMiddlewares.validateUserNotExistByEmail,
	validationMiddlewares.validateUserRolesInput,
]

const createTicketTypeMiddlewares = [
	userMiddlewares.verifyToken,
	userMiddlewares.checkUserIsAdmin,
	ticketTypeMiddlewares.checkTicketTypesAuthorizedRoles,
	validationMiddlewares.validateTicketTypeNameInput,
	ticketTypeMiddlewares.checkTicketTypeAlreadyExists,
]

const changePassword = [
	userMiddlewares.verifyToken,
	userMiddlewares.verifyPassword,
	validationMiddlewares.validatePasswordInput,
]

const updateTicketStatusMiddlewares = [
	userMiddlewares.verifyToken,
	ticketMiddlewares.checkTicketStatus,
]

const createTicketMiddlewares = [
	userMiddlewares.verifyTokenOrNext,
	validationMiddlewares.validateNameInput,
	validationMiddlewares.validateSurnameInput,
	validationMiddlewares.validatePhoneNumberInput,
	validationMiddlewares.validateEmailInput,
	validationMiddlewares.validateTicketPurposeInput,
	validationMiddlewares.validateIdentyNumber,
	validationMiddlewares.validateAddressInformationInput,
]

const getMessageMiddlewares = [
	userMiddlewares.verifyTokenOrNext,
	ticketMiddlewares.checkTicketId,
]

const createMessageMiddlewares = [
	userMiddlewares.verifyTokenOrNext,
	messageMiddlewares.checkMessageText,
]

const deleteUserMiddlewares = [
	userMiddlewares.verifyToken,
	userMiddlewares.checkUserIsAdmin,
]

const isAdmin = [userMiddlewares.verifyToken, userMiddlewares.checkUserIsAdmin]

const createRoleMiddlewares = [
	userMiddlewares.verifyToken,
	userMiddlewares.checkUserIsAdmin,
	roleMiddlewares.checkNewRoleName,
]

const addRoleForTicketTypeMiddlewares = [
	userMiddlewares.verifyToken,
	userMiddlewares.checkUserIsAdmin,
	ticketTypeMiddlewares.checkRoleAlreadyExist,
]

const updateTicketTypeMiddlewares = [
	userMiddlewares.verifyToken,
	ticketTypeMiddlewares.checkRoleAlreadyExist,
	validationMiddlewares.validateTicketTypeNameInput,
]

const updateUserMiddlewares = [
	userMiddlewares.verifyToken,
	userMiddlewares.checkUserIsAdmin,
	validationMiddlewares.validateNameInput,
	validationMiddlewares.validateSurnameInput,
	validationMiddlewares.validateEmailInput,
	validationMiddlewares.validateUserRolesInput,
	userMiddlewares.checkUpdatedUserEmail,
]

const updateTicketAssignmentAndStatusInformations = [
	userMiddlewares.verifyToken,
	ticketMiddlewares.checkIfTicketCanBeUpdated,
]

module.exports = {
	login,
	isAdmin,
	verifyToken: userMiddlewares.verifyToken,
	verifyTokenOrNext: userMiddlewares.verifyTokenOrNext,
	createUser: createUserMiddleware,
	createTicket: createTicketMiddlewares,
	getMessage: getMessageMiddlewares,
	createMessage: createMessageMiddlewares,
	changePassword,
	updateTicketStatus: updateTicketStatusMiddlewares,
	deleteUser: deleteUserMiddlewares,
	createTicketType: createTicketTypeMiddlewares,
	createRole: createRoleMiddlewares,
	checkRoleIdForFilter: roleMiddlewares.checkRoleIdForFilter,
	addRoleForTicketType: addRoleForTicketTypeMiddlewares,
	updateTicketType: updateTicketTypeMiddlewares,
	updateUser: updateUserMiddlewares,
	updateTicketAssignmentAndStatusInformations,
}
