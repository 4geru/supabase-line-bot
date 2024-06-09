
export const isResetPostback = (type: string) => {
    return type === "reset"
}

export const executeResetPostback = async (user: any) => {
    await user.updateStatus({ count: 0 })
    user.info.status.count = 0
}

export const replyResetPostback = (user: any, event: any) => {
    return [
        {
            "type": "text",
            "text": `リセットしました: ${user.info.status.count}`,
        }
    ]
}

