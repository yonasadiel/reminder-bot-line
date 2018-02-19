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
  receive : function(args, client, event) {
    gclient = client
    gevent  = event

    var url = 'https://ares.yonasadiel.com/reminder-bot'
    request({
      method: 'GET',
      uri: url,      
    },
    (err, res, body) => {
      var data = JSON.parse(body)
      var replyText = ''
      for (var token in data) {
        var obj = data[token]
        var remindText = ''
        obj.sort(sortByDue)

        for (var i=0; i<obj.length; i++) {
          remindText += (i+1) + '. ' + obj[i].due + ' ' + obj[i].desc
          if (i !== obj.length -1) { remindText += '\n' }
        }
        gclient.pushMessage(token, {
          type: 'text',
          text: remindText
        })
      }
    })
  }
};