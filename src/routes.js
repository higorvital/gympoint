const {Router} = require('express')

const StudentController = require('./app/controllers/StudentController')
const SessionController = require('./app/controllers/SessionController')
const PlanController = require('./app/controllers/PlanController')
const RegistrationController = require('./app/controllers/RegistrationController')
const CheckinController = require('./app/controllers/CheckinController')
const HelpOrderController = require('./app/controllers/HelpOrderController')
const AnswerController = require('./app/controllers/AnswerController')

const authMiddleware = require('./app/middlewares/auth')

const routes = new Router()

routes.post('/sessions', SessionController.store)

routes.get('/students/:id/checkins', CheckinController.index)
routes.post('/students/:id/checkins', CheckinController.store)

routes.get('/students/:id/help-orders', HelpOrderController.index)
routes.post('/students/:id/help-orders', HelpOrderController.store)

routes.use(authMiddleware)

routes.post('/students', StudentController.store)
routes.put('/students/:id', StudentController.update)

routes.get('/plans', PlanController.index)
routes.post('/plans', PlanController.store)
routes.put('/plans/:id', PlanController.update)
routes.delete('/plans/:id', PlanController.delete)

routes.get('/registrations', RegistrationController.index)
routes.post('/registrations', RegistrationController.store)
routes.put('/registrations/:id', RegistrationController.update)
routes.delete('/registrations/:id', RegistrationController.delete)

routes.post('/help-orders/:id/answer', AnswerController.store)

module.exports = routes