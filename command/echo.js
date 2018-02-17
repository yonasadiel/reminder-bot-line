
/**
 * Help
 * ------------------
 * Give an about reply about the bot
 * 
 * Every command file should have receive()
 * function with parameters:
 *   argc   : number of arguments
 *   args   : arguments presents on text message
 *   client : client object defined by line-bot-sdk
 *            for replying / etc
 *   event  : event webhook project that is sent
 *            by LINE messaging app, ex:
 *            "events": [
 *             {
 *               "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
 *               "type": "message",
 *               "timestamp": 1462629479859,
 *               "source": {
 *                 "type": "user",
 *                 "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
 *               },
 *               "message": {
 *                 "id": "325708",
 *                 "type": "text",
 *                 "text": "Hello, world"
 *               }
 *           },
 *             {
 *               "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
 *               "type": "follow",
 *               "timestamp": 1462629479859,
 *               "source": {
 *                 "type": "user",
 *                 "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
 *               }
 *             }
 *           ]
 */

module.exports = {
  receive : function(args, client, event) {
    var id = ''

    if (event.source.type === "group") {
      id = event.source.groupId
    } else if (event.source.type === "room") {
      id = event.source.roomId
    } else if (event.source.type === "user") {
      id = event.source.userId
    }

    for (var i=1; i<args.length; i++) {
      client.pushMessage(id, {
        type: 'text',
        text: args[i]
      })
    }
  }
};