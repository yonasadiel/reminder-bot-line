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

    var filename = data_folder + id + '.json'
    var replyText = ''
    fs.readFile(filename, 'utf8', (err, data) => {
      var obj = []
      if (err) {
        replyText = 'empty'
      } else {
        obj = JSON.parse(data)
        for (var i=0; i<obj.length; i++) {
          replyText += '- ' + obj[i].due + ' ' + obj[i].desc
        }
      }
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: replyText
      })
    })
  }
};