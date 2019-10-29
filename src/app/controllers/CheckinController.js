const Yup = require('yup')
const {Op} = require('sequelize')
const {startOfWeek, endOfWeek, parseISO} = require('date-fns')

const Checkin = require('../models/Checkin')
const Student = require('../models/Student')
const Registration = require('../models/Registration')

class CheckinController{
    async index(req, res){
        const {id: student_id} = req.params

        const student = await Student.findByPk(student_id)

        if(!student){
            return res.status(400).json({error: "Student doesn't exists"})
        }

        const registration = await Registration.findOne({where:{
            student_id
        }})

        if(!registration){
            return res.status(400).json({error: "Student doesn't have registration"})
        }

        const checkins = await Checkin.findAll({where: {
            student_id
        }})

        return res.json(checkins)

    }

    async store(req, res){
        const {id: student_id} = req.params

        const student = await Student.findByPk(student_id)

        if(!student){
            return res.status(400).json({error: "Student doesn't exists"})
        }

        const registration = await Registration.findOne({where:{
            student_id
        }})

        if(!registration){
            return res.status(400).json({error: "Student doesn't have registration"})
        }

        const currentDate = new Date()

        const hasFiveCheckins = await Checkin.findAll({where: {
            student_id,
            created_at: {
                [Op.between]: [startOfWeek(currentDate), endOfWeek(currentDate)]
            }
        }})

        console.log(currentDate)
        console.log(startOfWeek(currentDate))
        console.log(endOfWeek(currentDate))

        if(hasFiveCheckins.length >=5){
            return res.status(401).json({error: "Student already checked in 5 times this week"})
        }

        const checkin = await Checkin.create({student_id})

        return res.json(checkin)

    }

}

module.exports = new CheckinController()