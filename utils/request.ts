import axiod from 'https://deno.land/x/axiod@0.26.2/mod.ts';

export default async function (url: string, method: string, headers: HeadersInit, body?: BodyInit) {
  try {
    const resp = await axiod({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    })

    return resp
  } catch (e) {
    console.log(`Request error: ${e.message}`)
  }
}
