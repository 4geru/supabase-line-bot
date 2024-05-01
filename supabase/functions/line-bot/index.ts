// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { replyMessage, pushMessage } from './messages.ts'
import { supabaseClient } from './supabaseClient.ts'
import { Quiz } from "./quiz.ts"

console.log("Hello from Functions!")

serve(async (req) => {
  const { events } = await req.json()
  console.log(events)
  if (events && events[0]?.type === "message") {
    // 文字列化したメッセージデータ
    let messages:any = [
      {
        "type": "text",
        "text": "こんにちは！"
      },
      {
        "type": "text",
        "text": "テスト / test で単語を登録できます"
      }
    ]

    if (events[0].message.text.match(/\//g)) {
      // MEMO:
      // 送られたメッセージの中に `/` が含まれている場合は文字列を分割して保存する
      const [question, answer] = events[0].message.text.split('/')
      const quiz = new Quiz({question, answer})
      await quiz.saveToSupabase(supabaseClient(req))
      messages = quiz.savedMessages()
    }
    pushMessage(events[0].source.userId, messages)
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
