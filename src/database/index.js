const Sequelize = require('sequelize')

const databaseConfig = require('../config/database')

const Student = require('../app/models/Student')
const User = require('../app/models/User')
const Plan = require('../app/models/Plan')
const Registration = require('../app/models/Registration')
const Checkin = require('../app/models/Checkin')
const HelpOrder = require('../app/models/HelpOrder')

const models = [Student, User, Plan, Registration, Checkin, HelpOrder]

class Database{
    constructor(){
        this.init()
    }

    init(){
        this.connection = new Sequelize(databaseConfig)
        models
            .map(model=> model.init(this.connection))
            .map(model=> model.associate && model.associate(this.connection.models))
    }
}

module.exports = new Database()