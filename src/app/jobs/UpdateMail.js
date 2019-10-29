const {format, parseISO} = require('date-fns')
const pt = require('date-fns/locale/pt')
const Mail = require('../../lib/Mail')

class UpdateMail{
    get key(){
        return 'UpdateMail'
    }

    async handle({data}){

        const {registration, student, plan} = data

        console.log('a fila executou')

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Gympoint - Matrícula alterada',
            template: 'update',
            context: {
                student: student.name,
                title: plan.title,
                plan_price: plan.price,
                duration: plan.duration,
                start_date: format(
                    parseISO(registration.start_date),
                    "'dia' dd 'de' MMM",
                    {locale: pt}
                ), 
                end_date: format(
                    parseISO(registration.end_date),
                    "'dia' dd 'de' MMM",
                    {locale: pt}
                ), 
                total_price: registration.price,
            }
        })

    }
}

module.exports = new UpdateMail()