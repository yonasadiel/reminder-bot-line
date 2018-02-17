const fs = require('fs')

const data_folder = '/app/data/'

function sortByDue(a, b) {
  if (a.due < b.due) return -1;
  if (a.due > b.due) return 1;
  return 0;
}

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
        obj.sort(sortByDue)
        for (var i=0; i<obj.length; i++) {
          replyText += i + '. ' + obj[i].due + ' ' + obj[i].desc
        }
      }
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: replyText
      })
    })
  }
};