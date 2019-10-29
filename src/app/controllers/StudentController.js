const Yup = require('yup')
const Student = require('../models/Student')

class StudentController{
    async store(req, res){

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            age: Yup.number().positive().integer().required(),
            weight: Yup.number().positive().integer().required(),
            height: Yup.number().positive().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Invalid data"})
        }

        const studentExists = await Student.findOne({where: {email: req.body.email}})

        if(studentExists){
            return res.status(400).json({error: "User already exists"})
        }

        const {id, name, email, age, weight, height} = await Student.create(req.body)

        return res.json({
            id,
            name,
            email,
            age,
            weight,
            height
        })
    }

    async update(req, res){
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            age: Yup.number().positive().integer(),
            weight: Yup.number().positive().integer(),
            height: Yup.number().positive()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Invalid data"})
        }

        const {email} = req.body

        const student = await Student.findByPk(req.params.id)

        if(email !== student.email){

            const studentExists = await Student.findOne({where: {email}})

            if(studentExists){
                return res.status(400).json({error: "User already exists"})
            }
        }

        const {id, name, age, weight, height} = await student.update(req.body)

        return res.json({
            id,
            name,
            email,
            age,
            weight,
            height
        })
    }
}

module.exports = new StudentController()