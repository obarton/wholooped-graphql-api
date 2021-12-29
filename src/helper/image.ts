export const convertContentfulFileUrlToImageUrl = (contentfulImageUrl: string) => {
    return contentfulImageUrl ? `https:${contentfulImageUrl}` : null;
}