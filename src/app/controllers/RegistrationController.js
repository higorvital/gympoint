const Yup = require('yup')
const {endOfDay, parseISO, isBefore, addMonths} = require('date-fns')

const Registration = require('../models/Registration')
const Student = require('../models/Student')
const Plan = require('../models/Plan')
const WelcomeMail = require('../jobs/WelcomeMail')
const UpdateMail = require('../jobs/UpdateMail')
const Queue = require('../../lib/Queue')

class RegistrationController{

    async index(req, res){

        const {page=1} = req.query

        const registrations = await Registration.findAll({
            limit: 20,
            offset: (page-1)*20,
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id','name','email']
                },
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['id','title','duration','price']
                }
            ]
        })

        return res.json(registrations)
    }
    async store(req, res){
        const schema = Yup.object().shape({
            student_id: Yup
                .number()
                .integer()
                .positive()
                .required(),
            plan_id: Yup
                .number()
                .integer()
                .positive()
                .required(),
            start_date: Yup
                .date()
                .required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Invalid data"})
        }

        const {student_id, plan_id} = req.body

        const student = await Student.findByPk(student_id)

        if(!student){
            return res.status(400).json({error: "Student doesn't exists"})
        }

        const plan = await Plan.findByPk(plan_id)

        if(!plan){
            return res.status(400).json({error: "Plan doesn't exists"})
        }

        const registrationExists = await Registration.findOne({where:{
            student_id
        }})

        if(registrationExists){
            return res.status(400).json({error: "Student already has a registration"})
        }

        const start_date =  parseISO(req.body.start_date)

        if(isBefore(start_date, new Date())){
            return res.status(400).json({error: "You can't create a registration in the past"})
        }

        const months = plan.duration

        const end_date = endOfDay(addMonths(start_date, months))

        const price = months * plan.price

        const registration = await Registration.create({
            student_id,
            plan_id,
            start_date,
            end_date,
            price
        })

        Queue.add(WelcomeMail.key, {
            registration, student, plan
        })

        const {name, email} = student

        const {title} = plan

        return res.json({
            registration,
            student:{
                name,
                email
            },
            plan: title
        })

    }

    async update(req, res){
        const schema = Yup.object().shape({
            plan_id: Yup
                .number()
                .integer()
                .positive()
                .required(),
            start_date: Yup
                .date()
                .required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Invalid data"})
        }

        const {plan_id} = req.body

        const plan = await Plan.findByPk(plan_id)

        if(!plan){
            return res.status(400).json({error: "Plan doesn't exists"})
        }   

        const start_date =  parseISO(req.body.start_date)

        if(isBefore(start_date, new Date())){
            return res.status(400).json({error: "You can't create a registration in the past"})
        }

        const months = plan.duration

        const end_date = endOfDay(addMonths(start_date, months))

        const price = months * plan.price

        const registration = await Registration.findByPk(req.params.id)

        await registration.update({
            plan_id,
            start_date,
            end_date,
            price
        })

        const {student_id} = registration

        const student = await Student.findOne({where: {
            id: student_id
        }})

        Queue.add(UpdateMail.key, {
            registration, student, plan
        })

        const {name, email} = student

        const {title} = plan

        return res.json({
            registration,
            student: {
                name,
                email
            },
            plan: title
        })

    }

    async delete(req, res){
        const registration = await Registration.findByPk(req.params.id)

        if(!registration){
            return res.status(400).json({error: "Registration doesn't exists"})
        }

        await registration.destroy()

        return res.send()
    }
}

module.exports = new RegistrationController()