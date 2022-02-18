export const convertContentfulFileUrlToImageUrl = (contentfulImageUrl: string) => {
    return contentfulImageUrl ? `https:${contentfulImageUrl}` : null;
}

export const DEFAULT_IMG_URL = "https://images.ctfassets.net/vwlltmjzgrb5/2prwzQoN8F6XMRHm7bgZKt/af355c589492088853b9728496c48c29/placeholder.jpg";
export const DEFAULT_HEADER_IMG_URL = ""; //"https://images.ctfassets.net/vwlltmjzgrb5/117tE4i8K824fu2af7Tftg/277ebde59d7500dd91206344748064d2/banner-placeholder.jpg"