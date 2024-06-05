export const isCounterMessage = (text: string) => {
    // 正規表現: ^[0-9\s]*$ は、文字列の最初から最後までが数字または空白のみであることを表す
    const regex = /^[0-9\s]*$/;
    if(regex.test(text)) { return true }
    return false
}

export const executeCounterMessage = async (user: any) => {
    await user.updateStatus({ count: user.info.status.count + 1 })
}

export const replyCounterMessage = (user: any, event: any) => {
    return [
        {
            "type": "text",
            "text": `カウント: ${user.info.status.count}`
        }
    ]
}
