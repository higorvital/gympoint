const Sequelize = require('sequelize')
const {Model} = require('sequelize')
const bcrypt = require('bcryptjs')

class User extends Model{
    static init(sequelize){
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING
        },
        {
            sequelize
        })

        this.addHook('beforeSave', (user)=> {
            user.password_hash = bcrypt.hash(us.password, 8)
        })

        return this
    }

    checkPassword(password){
        return bcrypt.compare(password, this.password_hash)
    }
}

module.exports = User