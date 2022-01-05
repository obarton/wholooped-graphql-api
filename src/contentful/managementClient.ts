import contentful from 'contentful-management';

export const getManagementClient = () => {
    return contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
      })
}