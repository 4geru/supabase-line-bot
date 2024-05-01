export const replyMessage = (events, messages) => {
    const dataString = JSON.stringify({
        replyToken: events[0].replyToken,
        messages: messages
    })

    // https://developers.line.biz/ja/docs/messaging-api/nodejs-sample/#send-reply
    fetch('https://api.line.me/v2/bot/message/reply',
        {
            method: "POST",
            body: dataString,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + Deno.env.get('EMBED_LINE_CHANNEL_ACCESS_TOKEN')
            },
        }
    ).then(r => {console.log(r)})
    .catch(e => { console.log(e) })
}
