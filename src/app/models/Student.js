const Sequelize = require('sequelize')
const {Model} = require('sequelize')

class Student extends Model{
    static init(sequelize){
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            age: Sequelize.INTEGER,
            weight: Sequelize.INTEGER,
            height: Sequelize.FLOAT
        },
        {
            sequelize
        })

        return this
    }
}

module.exports = Student