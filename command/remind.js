const fs = require('fs')

const data_folder = '/app/data/'

function sortByDue(a, b) {
  if (a.due < b.due) return -1;
  if (a.due > b.due) return 1;
  return 0;
}

module.exports = {
  receive  : function(args, client, event) {

    fs.readdir(data_folder, (err, files) => {
      if (err) {
        console.log(err)
      } else {
        for (var i=0; i<files.length; i++) {
          if (!files[i].endsWith(".json")) continue;
          var id = files[i].substring(0, files[i].length-5)
          var filename = data_folder + files[i]
          var remindText = ''
          fs.readFile(filename, 'utf8', (err, data) => {
            var obj = []
            if (err) {
              console.log(err)
            } else {
              obj = JSON.parse(data)
              obj.sort(sortByDue)
              for (var i=0; i<obj.length; i++) {
                remindText += (i+1) + '. ' + obj[i].due + ' ' + obj[i].desc
                if (i !== obj.length -1) { remindText += '\n' }
              }
              client.pushMessage(id, {
                type: 'text',
                text: remindText
              })
              console.log([id, remindText])
            }
          })
        }
      }
    });

    
  }
};