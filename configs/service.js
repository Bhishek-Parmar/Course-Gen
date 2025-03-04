import axios from "axios";

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3'

const getVideos = async(query) => {
    const params = {
        part:'snippet',
        q:query,
        maxResults:2,
        type:'video',
        key: process.env.YOUTUBE_API_KEY
    }

    const resp = await axios.get(YOUTUBE_BASE_URL+'/search', {params})
    console.log(resp);
    
    return resp.data.items;
}

export default{
    getVideos
}