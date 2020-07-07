import axios from 'axios';
import cheerio from 'cheerio';

//다음 RSS 주소 기반으로 기사 제목 불러와서 기록하기
const getDaumRSSNews = async (rssURL) => {
    const html = await axios.get(rssURL);
    const $ = cheerio.load(html.data);
    const $bodyList = $('title');
    
    let data = '';
    $bodyList.each((i, elements) => {
            data += $(elements).text();
            data += '<br>\n';
    });
    return data;
}

//금일 시사 뉴스
const getHotNews = async () => {
    return getDaumRSSNews("https://media.daum.net/syndication/today_sisa.rss");
}

//금일 스포츠 뉴스
const getSportsNews = async () => {
    return getDaumRSSNews("https://media.daum.net/syndication/today_sports.rss");
}

const getNews = async () => {
    return await getDaumRSSNews("https://media.daum.net/syndication/today_sisa.rss") + "<br><br>" +
        await getDaumRSSNews("https://media.daum.net/syndication/today_sports.rss");
}

export default getNews;