export const convertContentfulFileUrlToImageUrl = (contentfulImageUrl: string) => {
    return contentfulImageUrl ? `https:${contentfulImageUrl}` : null;
}

export const DEFAULT_IMG_URL = "https://images.ctfassets.net/vwlltmjzgrb5/2prwzQoN8F6XMRHm7bgZKt/af355c589492088853b9728496c48c29/placeholder.jpg";