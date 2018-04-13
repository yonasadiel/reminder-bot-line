const express = require('express')
const line    = require('@line/bot-sdk')
const fs      = require('fs')
const config  = require('./config')

const data_folder    = './data/'
const command_folder = './command/'

const app = express()
const client = new line.Client(config)
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
})

app.get('/remind', (req, res) => {
  const remind = require(command_folder + 'remind')
  remind.receive(null, client, null)
  res.send({success: 'true'})
})

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  if (event.message.text.startsWith(config.commandSymbol)) {
    args = ['']
    args_i = 0
    quote = null
    text = event.message.text
    for (var i=0; i<text.length; i++) {
      if (text[i] === quote) { quote = null }
      else if (quote === null && (text[i] === '\'' || text[i] === '"')) {
        quote = text[i]
      } else if (text[i] === ' ' && quote === null) {
        args_i++
        args.push('')
      } else {
        args[args_i] += text[i]
      }
    }

    fs.readdir(command_folder, (err, files) => {
      if (err) {
        client.replyMessage(event.replyToken, {
          type: 'text',
          text: err
        })
      } else {
        var found = false
        for (var i=0; i<files.length; i++) {
          if (config.commandSymbol + files[i] === args[0] + ".js") {
            const command = require(command_folder + files[i])
            found = true
            command.receive(args, client, event)
          }
        }
        if (!found) {
          client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'no command found'
          })
        }
      }
    });

  } else {
    let re = /\bw+i+z+\b/i
    let text = event.message.text
    if (text.match(re)) {
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'spam detected : ' + text
      })
    }
  }
}

app.listen(process.env.PORT || 5000)