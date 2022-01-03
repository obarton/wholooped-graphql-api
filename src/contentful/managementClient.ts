import contentful from 'contentful-management';

export const getManagementClient = () => {
    return contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID as string,
        accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
      })
}