const Yup = require('yup')

const Plan = require('../models/Plan')

class PlanController{
    async index(req, res){
        const plans = await Plan.findAll()
        
        return res.json(plans)
    }

    async store(req, res){
        const schema = Yup.object().shape({
            title: Yup
                .string()
                .required(),
            duration: Yup
                .number()
                .integer()
                .positive()
                .required(),
            price: Yup
                .number()
                .positive()
                .required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Invalid data"})
        }

        const {title} = req.body

        const titleExists = await Plan.findOne({where: {
            title
        }})

        if(titleExists){
            return res.status(401).json({error: "Plan already exists"})
        }

        const plan = await Plan.create(req.body)

        return res.json(plan)

    }

    async update(req, res){
        const schema = Yup.object().shape({
            title: Yup
                .string(),
            duration: Yup
                .number()
                .integer()
                .positive(),
            price: Yup
                .number()
                .positive()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Invalid data"})
        }

        const plan = await Plan.findByPk(req.params.id)

        if(!plan){
            return res.status(400).json({error: "Plan doesn't exists"})
        }

        const {title} = req.body

        if(title){
            const titleExists = await Plan.findOne({where:{
                title
            }})

            if(titleExists){
                return res.status(401).json({error: "Plan already exists"})
            }
        }

        const newPlan = await plan.update(req.body)

        return res.json(newPlan)
    }

    async delete(req, res){
        const plan = await Plan.findByPk(req.params.id)

        if(!plan){
            return res.status(400).json({error: "Plan doesn't exists"})
        }

        await plan.destroy()

        return res.send()
    }
}

module.exports = new PlanController()