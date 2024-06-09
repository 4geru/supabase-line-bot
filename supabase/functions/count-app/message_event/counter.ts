export const isCounterMessage = (text: string) => {
    // 正規表現: ^[0-9\s]*$ は、文字列の最初から最後までが数字または空白のみであることを表す
    const regex = /^[0-9\s]*$/;
    if(regex.test(text)) { return true }
    return false
}

export const executeCounterMessage = async (user: any, text: string) => {
    const nextCount = user.info.status.count + sumStringNumbers(text);
    await user.updateStatus({ count: nextCount })
    user.info.status.count = nextCount
}

export const replyCounterMessage = (user: any, event: any) => {
    return [
        {
            "type": "text",
            "text": `カウント: ${user.info.status.count}`,
            // "quickReply": quickReply()
            "quickReply": quickReply()
                
        }
    ]
}

const  sumStringNumbers = (input: string): number => {
    // 文字列をスペースで分割し、各要素を数値に変換してから合計します
    return input.trim().split(' ')
        .reduce((sum, num) => sum + parseInt(num, 10), 0);
}

const quickReply = () => ({
    "items": [
        {
          "type": "action", // 3
          "imageUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjxF8Cfr-wjSvXiN74DPzkA0tbANjbG66hNR05v6yO0OP1GOmSwcbPFYNtTNnSCXKh05KI0udwwbfFip5zpNs06CEoc-OQ-Z0rOPDdO1BDY6DEvm-AftogJnFFP800YbFyHdhe6JJHh8AU/s800/reset_buttn_off.png",
          "action": {
            "type": "postback",
            "label": "Reset",
            "data": JSON.stringify({
                "type": "reset"
            }),
            "text": "リセットボタンが押されました"
          }
        },
        {
          "type": "action",
          "imageUrl": "https://example.com/tempura.png",
          "action": {
            "type": "message",
            "label": "Tempura",
            "text": "Tempura"
          }
        },
        {
          "type": "action", // 4
          "action": {
            "type": "location",
            "label": "Send location"
          }
        }
    ]
})
