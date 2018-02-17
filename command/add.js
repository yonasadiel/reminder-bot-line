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

    var data = require(data_folder + id)
    data.push({
      'due' : args[1],
      'desc' : args[2]
    })
    console.log(data)
    fs.writeFile(data_folder + id + '.json')

    client.replyMessage(client.replyToken, {
      type: 'text',
      text: 'success'
    })
  }
};