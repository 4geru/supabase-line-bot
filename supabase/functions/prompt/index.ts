// / <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// const session = new Supabase.ai.Session('mistral')
const session = new Supabase.ai.Session('llama2')
import { notifyMessage } from './messages.ts'

Deno.serve(async (req: Request) => {
  const params = new URL(req.url).searchParams
  const prompt = params.get('prompt') ?? ''
  notifyMessage(`user prompt: ${prompt}`)

  // Get the output as a stream
  const output = await session.run(prompt, { stream: true })

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  })
  // Create a stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      try {
        let message = ''
        for await (const chunk of output) {
          controller.enqueue(encoder.encode(chunk.response ?? ''))
          message = [...message, chunk.response].join('')
        }
        notifyMessage(message)
      } catch (err) {
        console.error('Stream error:', err)
      } finally {
        controller.close()
      }
    },
  })

  // Return the stream to the user
  return new Response(stream, {
    headers,
  })
})
