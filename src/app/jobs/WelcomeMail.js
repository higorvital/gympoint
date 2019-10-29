const {format, parseISO} = require('date-fns')
const pt = require('date-fns/locale/pt')
const Mail = require('../../lib/Mail')

class WelcomeMail{
    get key(){
        return 'WelcomeMail'
    }

    async handle({data}){

        const {registration, student, plan} = data

        console.log('a fila executou')

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Gympoint - Matrícula realizada',
            template: 'welcome',
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

module.exports = new WelcomeMail()