export const saveImage = async (event, supabase) => {
  const filePath = `${event.source.userId}/photo/${event.message.id}.jpg` // 画像の保存先のpathを指定
  // リクエストヘッダー
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')
  }

  // https://developers.line.biz/ja/reference/messaging-api/#get-content
  const response = await fetch(`https://api-data.line.me/v2/bot/message/${event.message.id}/content`,
    {
        method: "GET",
        headers: headers,
    }
  );
  const blob = await response.blob();
  console.log(response)
  // https://supabase.com/docs/reference/javascript/storage-from-upload
  const { data, error } = await supabase
    .storage
    .from('photo')
    .upload(filePath, blob, {
      contentType: 'image/jpg'
    })
}

export const getImageButtonMessage = async (event, supabase) => {
  // https://supabase.com/docs/reference/javascript/storage-from-list
  const { data, error } = await supabase
    .storage
    .from('photo')
    .list(`${event.source.userId}/photo`, {
      limit: 10,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })
  console.log({data, error})

  const images = data.filter(item =>
    // LINE に保存されている画像は jpg のみ
    item.name.match(/jpg/g)// ||
    // item.name.match(/jpeg/g) ||
    // item.name.match(/png/g)
  )
  return {
    "type": "template",
    "altText": "This is a buttons template",
    "template": {
      "type": "buttons",
      "text": "Please select image",
      "actions": images.slice(0, 4).map(item => ({
        "type": "postback",
        "label": item.name.slice(0, 20),
        "data": JSON.stringify({name: item.name})
      }))
    }
  }
}

export const getImageMessages = async (event, supabase) => {
  const postbackData = JSON.parse(event.postback.data)
  // https://supabase.com/docs/reference/javascript/storage-from-getpublicurl
  const { data } = supabase
    .storage
    .from('photo')
    .getPublicUrl(`${event.source.userId}/photo/${postbackData.name}`)
  return [
    {
      "type": "text",
      "text": data.publicUrl
    },
    {
      "type": "image",
      "originalContentUrl": data.publicUrl,
      "previewImageUrl": data.publicUrl
    }
  ]
}
