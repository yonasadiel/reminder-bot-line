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

    if (args.length != 2) {
      gclient.replyMessage(gevent.replyToken, {
        type: 'text',
        text: 'usage: !delete <id>'
      })
      return
    }

    if (event.source.type === "group") {
      id = event.source.groupId
    } else if (event.source.type === "room") {
      id = event.source.roomId
    } else if (event.source.type === "user") {
      id = event.source.userId
    }

    var url = 'https://ares.yonasadiel.com/reminder-bot?token=' + id
    request({
      method: 'GET',
      uri: url,      
    },
    (err, res, body) => {
      var data = JSON.parse(body)
      var replyText = ''
      if (data.length === 0) {
        replyText = 'there is no reminder, what on earth you want to delete?'
      } else if (data.length < args[1]-1) {
        replyText = 'wait, what? you only have ' + data.length + ' reminder bruh.'
      } else {
        data.sort(sortByDue)
        var del_url = 'https://ares.yonasadiel.com/reminder-bot/' + data[args[1]-1].id
        request({
          method: 'DELETE',
          uri: del_url
        },
        (err, res, body) => {
          var del_data = JSON.parse(body)
        })
        replyText = 'deleted: ' + data[args[1]-1].due + ' ' + data[args[1]-1].desc + '\n'
      }
      gclient.replyMessage(gevent.replyToken, {
        type: 'text',
        text: replyText
      })
    })
  }
};