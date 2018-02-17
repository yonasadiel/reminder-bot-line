const fs = require('fs')

const data_folder = '../data/'

module.exports = {
  argc       : 0,
  args       : [],
  event      : '',
  client     : '',
  session    : {},
  session_id : '',

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
    fs.readFile(filename, 'utf8', (err, data) => {
      var obj = []
      if (err) {
        fs.closeSync(fs.openSync(filename, 'w'));
      }
      else { obj = JSON.parse(data) }
      obj.push({
        'due' : args[1],
        'desc' : args[2]
      })
      json = JSON.stringify(obj)
      fs.writeFile(filename, json, 'utf8', (err) => {
        console.log(err)
      })
    })

    client.replyMessage(client.replyToken, {
      type: 'text',
      text: 'success'
    })
  }
};