export const replyMessage = (events, messages) => {
    const dataString = JSON.stringify({
        replyToken: events[0].replyToken,
        messages: messages
    })

    // リクエストヘッダー
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Deno.env.get('TEST_LINE_CHANNEL_ACCESS_TOKEN')
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
export const flexMessage = (contents) => {
    return {
        "type": "flex",
        "altText": "This is a Flex Message",
        "contents": contents
    }
}

export const flashCardMessage = (body, data?) => {
    return {
        "type": "template",
        "altText": "単語帳のメッセージを表示中",
        "template": {
            "type": "buttons",
            "text": `「${body}」`,
            "actions": [
                {
                    // postback event
                    // https://developers.line.biz/en/reference/messaging-api/#postback-event
                    "type": "postback",
                    "label": "答えを見る",
                    "inputOption": "openRichMenu",
                    "data": JSON.stringify(data || {action: 'buy', itemid: 111, list: []}),
                }
            ]
        }
    }
}