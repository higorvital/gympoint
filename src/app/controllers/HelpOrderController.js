const Yup = require('yup')

const HelpOrder = require('../models/HelpOrder')
const Student = require('../models/Student')

class HelpOrderController{
    async index(req, res){
        
        const {id: student_id} = req.params

        const student = await Student.findByPk(student_id)

        if(!student){
            return res.status(400).json({error: "Student doesn't exists"})
        }

        const help_orders = await HelpOrder.findAll({where: {
            student_id
        }})

        return res.json(help_orders)
        
    }

    async store(req, res){

        const {question} = req.body

        if(!question){
            return res.status(400).json({error: "Invalid data"})
        }

        const {id: student_id} = req.params

        const student = await Student.findByPk(student_id)

        if(!student){
            return res.status(400).json({error: "Student doesn't exists"})
        }

        const help_order = await HelpOrder.create({
            student_id,
            question
        })

        return res.json(help_order)
    }
}

module.exports = new HelpOrderController()