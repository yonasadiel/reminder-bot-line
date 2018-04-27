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
        replies = [
          'there is no reminder, what on earth you want to delete?',
          'you have no reminder... don\'t act like you have one.',
          'no reminder found. maybe you want to add some first?',
          'umm... looks like you forgot you don\'t have reminder... or am i?'
        ]
        replyText = replies[Math.floor(Math.random() * replies.length)]
      } else if (data.length < args[1]-1) {
        replies = [
          'wait, what? you only have ' + data.length + ' reminder bruh.',
          'clearly you don\'t have that much things to do.',
          'maybe you should !show before !delete',
          'what? maybe this person below know what do you mean by that\nvvvv'
        ]
        replyText = replies[Math.floor(Math.random() * replies.length)]
      } else if (args[1]-1 <= 0) {
        replies = [
          'weird, i only know number 1 to ' + data.length,
          'hey! i\'m not that stupid, you know.',
          'typo?',
          'oh no. i\'m buffer-overflowing.'
        ]
        replyText = replies[Math.floor(Math.random() * replies.length)]
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