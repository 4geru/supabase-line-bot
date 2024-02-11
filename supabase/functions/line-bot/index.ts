// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { supabaseClient } from './supabaseClient.ts'
import { Quiz } from "./quiz.ts"
import { flashCardFlexMessage, replyMessage } from './messages.ts'
import { shuffle } from "./lib.ts"

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

    if (events[0].message.text === 'スタート') {
      const { data, error } = await supabaseClient().from('quiz').select('id')
      const quizList = shuffle(data).slice(0, 5)
      const { data: [quiz] } = await supabaseClient().from('quiz')
        .select('question')
        .eq('id', quizList[0].id)
      // クイズを開始する
      messages = [
        {
          "type": "text",
          "text": "問題を始めるよ！"
        },
        flashCardFlexMessage(quiz.question, {list: quizList})
      ]
      console.log({ messages, quizList })
    } else if (events[0].message.text.match(/\//g)) {
      // MEMO:
      // 送られたメッセージの中に `/` が含まれている場合は文字列を分割して保存する
      const [question, answer] = events[0].message.text.split('/')
      const quiz = new Quiz({question, answer})
      await quiz.saveToSupabase(supabaseClient())
      messages = quiz.savedMessages()
    }
    replyMessage(events, messages)
  }

  if (events && events[0]?.type === "postback") {
    const postbackMessages = [
      {
        "type": "text",
        "text": `data：${events[0].postback.data}`
      }
    ]
    const messages = [
      ...postbackMessages
    ]
    const postbackData = JSON.parse(events[0].postback.data)
    let [first, ...list] = postbackData.list

    if(postbackData.action === 'nextCard') {
      const { data: quiz } = await supabaseClient().from('quiz')
        .select('id,answer,question,count')
        .in('id', [first.id, list[0]?.id].filter(item => item))
      const [answerQuiz, nextQuiz] = quiz[0].id == first.id ?
        [quiz[0], quiz[1]] :
        [quiz[1], quiz[0]]
      const nextCount = answerQuiz.count + 1
      await supabaseClient(req)
        .from('quiz')
        .update({ count: nextCount })
        .eq('id', first.id)
      messages.push({
          "type": "text",
          "text": `こたえは「${answerQuiz.answer}」です`
      })
      messages.push({
        "type": "text",
        "text": `${nextCount}回押されました`
      })
      if(list.length > 0) {
        messages.push(
          flashCardFlexMessage(nextQuiz.question, {list: list}) // 続きの問題を返す
        )
      } else {
        messages.push({
          "type": "text",
          "text": `おわったよ！`
        })
      }
    }
    if(postbackData.action === 'deleteCard') {
      await supabaseClient().from('quiz').delete().eq('id', first.id)
      messages.push({
          "type": "text",
          "text": "削除しました"
      })
    }
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
