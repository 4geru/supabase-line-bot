// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { replyMessage } from './messages.ts'

console.log("Hello from Functions!")

serve(async (req) => {
  const { events } = await req.json()
  console.log(events)
  if (events && events[0]?.type === "message") {
    // 文字列化したメッセージデータ
    let messages:any = [
      {
        "type": "text",
        "text": `受け取ったメッセージ：${events[0].message.text}`,
        "quoteToken": events[0].message.quoteToken,
        sender: {
          "name": "おうむ返しさん",
          "iconUrl": "https://2.bp.blogspot.com/-7LcdiJjflkE/XASwYu6DyuI/AAAAAAABQZs/K0EQCKmvDmsVbEES7sAb6_xJhJyQXXLFgCLcBGAs/s40-c/bluebird_robot_bot.png"
        }
      },
      {
        "type": "text",
        "text": "テスト / test で単語を登録できます",
        sender: {
          "name": "実況お兄さん",
          "iconUrl": "https://2.bp.blogspot.com/-Qlj91t78oGY/Us_MAKjaVFI/AAAAAAAAc_c/hLmCvD-VjB0/s40-c/job_sports_jikkyou.png"
        }
      },
      {
        "type": "sticker",
        "packageId": 11537,
        "stickerId": 52002734,
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "スタート",
                "text": "スタート"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "location",
                "label": "位置を送る"
              }
            }
          ]
        }
      }
    ]
    replyMessage(events, messages)
  }

  return new Response(
    JSON.stringify({status: 'ok'}),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
