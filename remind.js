const line    = require('@line/bot-sdk')
const fs      = require('fs')
const config  = require('./config')

const data_folder    = './data/'
const command_folder = './command/'

const client = new line.Client(config)

const remind = require(command_folder + 'remind')
command.receive(null, client, null)
