const fs = require('fs')

const data_folder = '/app/data/'

module.exports = {
  receive  : function(args, client, event) {
    var id = ''

    if (event.source.type === "group") {
      id = event.source.groupId
    } else if (event.source.type === "room") {
      id = event.source.roomId
    } else if (event.source.type === "user") {
      id = event.source.userId
    }

    var url = 'https://ares.yonasadiel.com/reminder-bot'
    await request({
      method: 'POST',
      uri: url,
      form: {
        'due': args[1],
        'desc': args[2],
        'token': id
      }  
    },
    (err, res, body) => {
      data = JSON.parse(body)
      //
    })

    client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'success'
    })
  }
};