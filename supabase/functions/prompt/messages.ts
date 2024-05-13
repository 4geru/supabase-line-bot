const LINE_NOTIFY_TOKEN = 'ADhXLbhZwe9lCheEi1yFFE8s1pBsJ1TdSQy43KwEgOC'

export const notifyMessage = (text) => {
  console.log('notifyMessage', text)
  // リクエストヘッダー
  const headers = {
      "Authorization": "Bearer " + LINE_NOTIFY_TOKEN,
      'Content-Type': 'application/x-www-form-urlencoded',
  }
  const dataString = `message=${text}`

  // https://developers.line.biz/ja/docs/messaging-api/nodejs-sample/#send-reply
  fetch('https://notify-api.line.me/api/notify',
      {
          method: "POST",
          body: dataString,
          headers: headers,
      }
  ).then(r => {console.log(r)})
  .catch(e => { console.log(e) })
}

export const replyMessage = (events, messages) => {
    const dataString = JSON.stringify({
        replyToken: events[0].replyToken,
        messages: messages
    })

    // リクエストヘッダー
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Deno.env.get('EMBED_LINE_CHANNEL_ACCESS_TOKEN')
    }

    // https://developers.line.biz/ja/docs/messaging-api/nodejs-sample/#send-reply
    fetch('https://api.line.me/v2/bot/message/reply',
        {
            method: "POST",
            body: dataString,
            headers: headers,
        }
    ).then(r => {console.log(r)})
    .catch(e => { console.log(e) })
}
