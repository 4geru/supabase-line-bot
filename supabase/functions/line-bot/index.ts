// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { supabaseClient } from './supabaseClient.ts'
import { replyMessage } from './messages.ts'
import { saveImage, getImageButtonMessage, getImageMessages } from './image-functions.ts'
console.log("Hello from Functions!")

serve(async (req) => {
  const { events } = await req.json()
  console.log(events)

  if (events && events[0]?.type === "message" && events[0]?.message.type === "image") {
    await saveImage(events[0], supabaseClient(req))
    replyMessage(events, [{type: "text", text: "画像を保存しました"}])
  }
  if (events && events[0]?.type === "message" && events[0]?.message.type === "text") {
    const buttonTemplate = await getImageButtonMessage(events[0], supabaseClient(req))
    replyMessage(events, [buttonTemplate])
  }
  if (events && events[0]?.type === "postback") {
    const imageMessages = await getImageMessages(events[0], supabaseClient(req))
    replyMessage(events, imageMessages)
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
