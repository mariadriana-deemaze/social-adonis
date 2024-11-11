import LinkMetadata from '#models/link-metadata'
import { LinkResponse } from 'app/interfaces/post'
import { differenceInHours } from 'date-fns'
import env from '#start/env'

export default class LinkParserService {
  private API_Link: string
  private API_Key: string

  constructor() {
    this.API_Link = 'https://api.linkpreview.net'
    this.API_Key = env.get('LINK_PREVIEW_API')
  }

  async get(link: string): Promise<{
    title: string
    description: string
    image: string
  } | null> {
    const data = fetch(this.API_Link, {
      method: 'POST',
      headers: {
        'X-Linkpreview-Api-Key': this.API_Key,
      },
      mode: 'cors',
      body: JSON.stringify({ q: link }),
    })
      .then((res) => {
        if (res.status != 200) {
          console.log(res.status)
          throw new Error('something went wrong')
        }
        return res.json()
      })
      .then((response: { title: string; description: string; image: string }) => {
        return {
          title: response.title,
          description: response.description,
          image: response.image,
        }
      })
      .catch((error) => {
        console.log(error)
        return null
      })

    return data
  }

  async store(link: string): Promise<LinkResponse | null> {
    const metadata = await this.get(link)
    if (!metadata) return null
    const record = await LinkMetadata.create({
      link,
      metadata: {
        title: metadata.title,
        description: metadata.description,
        thumbnail: metadata.image,
      },
    })
    return this.serialize(record)
  }

  async update(record: LinkMetadata): Promise<LinkResponse | null> {
    const data = await this.get(record.link)
    record.metadata.thumbnail = data?.image || record.metadata.thumbnail
    record.metadata.title = data?.title || record.metadata.title
    record.metadata.description = data?.description || record.metadata.description
    record.enableForceUpdate()
    await record.save()
    return this.serialize(record)
  }

  async show(link: string | null): Promise<LinkResponse | null> {
    if (!link) return null
    const record = await LinkMetadata.findBy('link', link)
    let resource: LinkResponse | null
    if (record) {
      if (differenceInHours(new Date(), record?.updatedAt.toJSDate()) >= 12) {
        resource = await this.update(record)
      } else {
        resource = this.serialize(record)
      }
    } else {
      resource = await this.store(link)
    }
    return resource
  }

  private serialize(record: LinkMetadata): LinkResponse {
    return {
      id: record.id,
      link: record.link,
      metadata: record.metadata,
    }
  }
}
