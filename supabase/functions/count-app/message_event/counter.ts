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
            "text": `カウント: ${user.info.status.count}`
        }
    ]
}

function sumStringNumbers(input: string): number {
    // 文字列をスペースで分割し、各要素を数値に変換してから合計します
    return input.trim().split(' ')
        .reduce((sum, num) => sum + parseInt(num, 10), 0);
}
