import { streamText } from "ai"
import { customModel } from "../ai/index.js"
import { saveDocument } from "#src/services/documentService.js"
import { generateUUID } from "#src/utils/dbUtils.js"

export const getWeather = async ({ location }) => {
    return {
      location,
      temperature: 25,
    }
  }


export const createDocumentTool = async ({ title, kind, dataStream, context }) => {
  const id = generateUUID()
  const {chatId} = context

  let draftText = ''

  dataStream.writeData({
    type: 'clear',
    content: '',
  })

  if (kind === 'text') {
    const { fullStream } = streamText({
      model: customModel('gpt-4o-mini'),
      system: 'Write about the given topic. Markdown is supported.',
      prompt: title,
    })

    for await (const delta of fullStream) {
      const { type } = delta
      if (type === 'text-delta') {
        const { textDelta } = delta 
        draftText += textDelta 
        dataStream.writeData({
          type: 'text-delta',
          content: textDelta,
        })
      }
    }

    dataStream.writeData({
      type: 'finish',
      content: ''
    })
  }


  if (chatId) {
    await saveDocument({
      id,
      title,
      content: draftText,
      kind,
      chatId,
    })
  }

  return {
    id,
    title,
    kind,
    content: 'A document was created and is now visible to the user.',
  }
}