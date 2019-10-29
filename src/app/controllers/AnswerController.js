const HelpOrder = require('../models/HelpOrder')
const Student = require('../models/Student')
const Queue = require('../../lib/Queue')
const HelpOrderMail = require('../jobs/HelpOrderMail')

class AnswerController{
    async store(req, res){

        const {answer} = req.body

        if(!answer){
            return res.status(400).json({error: "Invalid data"})
        }

        const {id} = req.params

        const help_order = await HelpOrder.findByPk(id)

        if(!help_order){
            return res.status(400).json({error: "Help order doesn't exists"})
        }

        const answer_at = new Date()

        await help_order.update({answer, answer_at})

        const {student_id} = help_order

        const student = await Student.findByPk(student_id)

        Queue.add(HelpOrderMail.key, {
            student, help_order
        })

        return res.json(help_order)

    }
}

module.exports = new AnswerController()