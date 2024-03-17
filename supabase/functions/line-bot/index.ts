// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { supabaseClient } from './supabaseClient.ts'
import { replyMessage } from './messages.ts'
console.log("Hello from Functions!")

serve(async (req) => {
  const { events } = await req.json()
  console.log(events)

  if (events && events[0]?.type === "message" && events[0]?.message.type === "image") {
    const filePath = `${events[0].source.userId}/photo/${events[0].message.id}.jpg` // 画像の保存先のpathを指定
    // リクエストヘッダー
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')
    }

    // https://developers.line.biz/ja/docs/messaging-api/nodejs-sample/#send-reply
    await fetch(`https://api-data.line.me/v2/bot/message/${events[0].message.id}/content`,
        {
            method: "GET",
            headers: headers,
        }
    ).then(async (response) => {
      const blob = await response.blob();
      console.log(response)
      // https://supabase.com/docs/reference/javascript/storage-from-upload
      const { data, error } = await supabaseClient(req)
        .storage
        .from('photo')
        .upload(filePath, blob, {
          contentType: 'image/jpg'
        })
      console.log(data, error)

      replyMessage(events, [{type: "text", text: "画像を保存しました"}])
    });
  }
  if (events && events[0]?.type === "message" && events[0]?.message.type === "text") {
    // https://supabase.com/docs/reference/javascript/storage-from-list
    const { data, error } = await supabaseClient(req)
      .storage
      .from('photo')
      .list('public', {
        limit: 10,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })
    console.log({data, error})

    const images = data.filter(item =>
      item.name.match(/jpg/g) ||
      item.name.match(/jpeg/g) ||
      item.name.match(/png/g)
    )
    const buttonTemplate = {
        "type": "template",
        "altText": "This is a buttons template",
        "template": {
          "type": "buttons",
          "text": "Please select image",
          "actions": images.slice(0, 4).map(item => ({
            "type": "postback",
            "label": item.name.slice(0, 10),
            "data": JSON.stringify({name: item.name})
          }))
        }
      }

    let messages:any = [buttonTemplate]
    replyMessage(events, messages)
  }

  if (events && events[0]?.type === "postback") {
    const postbackData = JSON.parse(events[0].postback.data)
    // https://supabase.com/docs/reference/javascript/storage-from-getpublicurl
    const { data } = supabaseClient(req)
     .storage
     .from('photo')
     .getPublicUrl(`${events[0].source.userId}/photo${postbackData.name}`)
    let messages:any = [
      {
        "type": "text",
        "text": JSON.stringify(data)
      },
      {
        "type": "image",
        "originalContentUrl": data.publicUrl,
        "previewImageUrl": data.publicUrl
      }
    ]

    replyMessage(events, messages)
  }

  return new Response(
    JSON.stringify({ status: "ok"}),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
