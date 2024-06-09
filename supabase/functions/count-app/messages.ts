export const replyMessage = (events, messages) => {
    const dataString = JSON.stringify({
        replyToken: events[0].replyToken,
        messages: messages
    })

    // リクエストヘッダー
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Deno.env.get('193ekdme_LINE_CHANNEL_ACCESS_TOKEN')
    }

    // https://developers.line.biz/ja/docs/messaging-api/nodejs-sample/#send-reply
    fetch('https://api.line.me/v2/bot/message/reply',
        {
            method: "POST",
            body: dataString,
            headers: headers,
        }
    ).then(r => { console.log('=== replied ==='); console.log(r)})
    .catch(e => { console.log(e) })
}

export const pushMessage = (toId, messages) => {
    const dataString = JSON.stringify({
        to: toId,
        messages: messages.map((message) => {
            return {
                type: message.type,
                text: `push >> ${message.text}`
            }
        })
    })

    // リクエストヘッダー
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Deno.env.get('193ekdme_LINE_CHANNEL_ACCESS_TOKEN')
    }

    // https://developers.line.biz/ja/docs/messaging-api/nodejs-sample/#send-reply
    fetch('https://api.line.me/v2/bot/message/push',
        {
            method: "POST",
            body: dataString,
            headers: headers,
        }
    ).then(r => { console.log('=== pushed ==='); console.log(r)})
    .catch(e => { console.log(e) })
}
