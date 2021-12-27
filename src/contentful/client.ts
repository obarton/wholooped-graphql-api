import contentful from 'contentful';

export const getClient = () => {
    return contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID as string,
        accessToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string
      })
}