const fs = require('fs')
const request = require('request')

const data_folder = '/app/data/'
var gclient = ''
var gevent = ''

function sortByDue(a, b) {
  if (a.due < b.due) return -1;
  if (a.due > b.due) return 1;
  return 0;
}

module.exports = {
  receive  : function(args, client, event) {
    var id = ''
    gclient = client
    gevent  = event

    if (event.source.type === "group") {
      id = event.source.groupId
    } else if (event.source.type === "room") {
      id = event.source.roomId
    } else if (event.source.type === "user") {
      id = event.source.userId
    }

    var url = 'https://ares.yonasadiel.com/reminder-bot?token=' + id
    await request({
      method: 'GET',
      uri: url,      
    },
    (err, res, body) => {
      data = JSON.parse(body)
      var replyText = ''
      if (data.length === 0) {
        replyText = 'empty'
      } else {
        data.sort(sortByDue)
        var del_url = 'https://ares.yonasadiel.com/reminder-bot/' + data[args[1]-1].id
        request({
          method: 'DELETE',
          uri: url
        })
      }
      gclient.replyMessage(gevent.replyToken, {
        type: 'text',
        text: replyText
      })
    })
  }
};