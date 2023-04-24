/**
 * helper functions for assets provided by directus
 * file in the provided functions is a file object as provided
 * by the directus API
 * 
 * @param {string} baseURL
 * @param {string} accessToken 
 * @returns 
 */
const useAsset = (baseURL, accessToken) => {
    // const noImageDataUri = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjMwMHB4IiB3aWR0aD0iMzAwcHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iLTMwMCAtMzAwIDYwMCA2MDAiIGZvbnQtZmFtaWx5PSJCaXRzdHJlYW0gVmVyYSBTYW5zLExpYmVyYXRpb24gU2FucywgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogIAogIDxjaXJjbGUgc3Ryb2tlPSIjQUFBIiBzdHJva2Utd2lkdGg9IjEwIiByPSIyODAiIGZpbGw9IiNGRkYiLz4KICA8c3dpdGNoIHN0eWxlPSJmaWxsOiM0NDQ7Ij4KICAgIDx0ZXh0IGlkPSJ0cnN2ZzMtYm4iIHN5c3RlbUxhbmd1YWdlPSJibiI+PHRzcGFuIHg9IjAiIHk9Ii04IiBpZD0idHJzdmcxLWJuIj4mI3g5OUI7JiN4OUFDOyYjeDlCRjsgJiN4OTg5OyYjeDlBQTsmI3g5QjI7JiN4OUFEOyYjeDlDRDsmI3g5QUY7PC90c3Bhbj48dHNwYW4geD0iMCIgeT0iODAiIGlkPSJ0cnN2ZzItYm4iPiYjeDlBODsmI3g5REY7PC90c3Bhbj48L3RleHQ+CiAgICA8dGV4dCBpZD0idHJzdmczLWlkIiBzeXN0ZW1MYW5ndWFnZT0iaWQiPjx0c3BhbiB4PSIwIiB5PSItOCIgaWQ9InRyc3ZnMS1pZCI+R0FNQkFSIFRBSzwvdHNwYW4+PHRzcGFuIHg9IjAiIHk9IjgwIiBpZD0idHJzdmcyLWlkIj5URVJTRURJQTwvdHNwYW4+PC90ZXh0PgogICAgPHRleHQgaWQ9InRyc3ZnMy1lbiIgc3lzdGVtTGFuZ3VhZ2U9ImVuIj48dHNwYW4geD0iMCIgeT0iLTgiIGlkPSJ0cnN2ZzEtZW4iPk5PIElNQUdFPC90c3Bhbj48dHNwYW4geD0iMCIgeT0iODAiIGlkPSJ0cnN2ZzItZW4iPkFWQUlMQUJMRTwvdHNwYW4+PC90ZXh0PgogICAgPHRleHQgaWQ9InRyc3ZnMyI+PHRzcGFuIHg9IjAiIHk9Ii04IiBpZD0idHJzdmcxIj5OTyBJTUFHRTwvdHNwYW4+PHRzcGFuIHg9IjAiIHk9IjgwIiBpZD0idHJzdmcyIj5BVkFJTEFCTEU8L3RzcGFuPjwvdGV4dD4KICA8L3N3aXRjaD4KPC9zdmc+Cg=='
    
    const isImage = (file) => file?.type.match(/^image/i)
    const url = (file, download=true) => {
        let assetURL = `${baseURL}/assets/${file?.id}?access_token=${accessToken}`
        if(download) assetURL +='&download='
        return assetURL
    }
    const thumbnail = (file, options={}) => {
        const {fit='contain', width=100, height=100, quality=80} = options
        let thumbnail = url(file) + `&fit=${fit}&width=${width}&height=${height}&quality=${quality}`
        return thumbnail
    }
    return {
        isImage,
        url,
        thumbnail,
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

export {useAsset, formatBytes}