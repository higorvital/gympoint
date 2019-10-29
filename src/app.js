require('dotenv/config')

const express = require('express')
const Sentry = require('@sentry/node')
const Youch = require('youch')

require('express-async-errors')

const routes = require('./routes')
const sentryConfig = require('./config/sentry')

require('./database')

class App{
    constructor(){
        this.server = express()

        const sentryConfig = require('./config/sentry')

        this.middleware()
        this.routes()
        this.exceptionHandler()
    }

    middleware(){
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(express.json())
    }

    routes(){
        this.server.use(routes)
        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler(){
        this.server.use(async (err, req, res, next)=>{

            if(process.env.NODE_ENV === 'development'){
                const errors = await new Youch(err, req).toJSON()
                return res.status(500).json(errors)
            }

            return res.status(500).json({error: "Internal server error"})
        })
    }
}

module.exports = new App().server