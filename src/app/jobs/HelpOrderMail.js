const {format, parseISO} = require('date-fns')
const pt = require('date-fns/locale/pt')
const Mail = require('../../lib/Mail')

class UpdateMail{
    get key(){
        return 'HelpOrder'
    }

    async handle({data}){

        const {student, help_order} = data

        console.log('a fila executou')

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Gympoint - Pedido de auxílio',
            template: 'help_order',
            context: {
                student: student.name,
                question: help_order.question,
                answer: help_order.answer,
            }
        })

    }
}

module.exports = new UpdateMail()