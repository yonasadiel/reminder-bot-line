const fs = require('fs')

const data_folder = './data/'

module.exports = {
  receive  : function(args, client, event) {
    var id = ''
    console.log(process.cwd())

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
        console.log('file not found')
        fs.closeSync(fs.openSync(filename, 'wx'));
      } else {
        obj = JSON.parse(data)
      }
      obj.push({
        'due' : args[1],
        'desc' : args[2]
      })
      json = JSON.stringify(obj)
      fs.writeFile(filename, json, 'utf8', (err) => {
        if (err) console.log(err)
      })
    })

    client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'success'
    })
  }
};