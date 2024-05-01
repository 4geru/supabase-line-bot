// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { replyMessage } from './replyMessage.ts'
import { supabaseClient } from './supabaseClient.ts'

console.log("Hello from Functions!")
const session = new Supabase.ai.Session('gte-small');

serve(async (req) => {
  const { events } = await req.json()
  console.log(events)
  if (events && events[0]?.type === "message") {

    const input = events[0].message.text
    // Generate the embedding from the user input
    const embedding = await session.run(input, {
      mean_pool: true,
      normalize: true,
    });

    // 文字列化したメッセージデータ
    let messages:any = [
      {
        "type": "text",
        "text": events[0].message.text
      },
    ]

    // Store the vector in Postgres
    const supabase = supabaseClient()
    const { data: documents } = await supabase.rpc('match_documents', {
      query_embedding: embedding, // Pass the embedding you want to compare
      match_threshold: 0.78, // Choose an appropriate threshold for your data
      match_count: 3, // Choose the number of matches
    })
    console.log({documents})
    documents.map((doc) => {
      messages.push({
        "type": "text",
        "text": `Matched: ${doc.body}`
      })
    })

    const { data, error } = await supabase.from('documents').insert({
      body: events[0].message.text,
      embedding,
    })

    console.log(embedding)
    replyMessage(events, messages)
  }

  return new Response(
    JSON.stringify({status: 'ok'}),
    { headers: { "Content-Type": "application/json" } },
  )
})
