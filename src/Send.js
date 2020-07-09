import * as thecamp from 'the-camp-lib';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import getNews from './News';

dotenv.config();

const Send = async () => {

    // dotenv에 저장해 둔 더캠프 아이디와 비밀번호 불러오기
    const {
        THE_CAMP_ID,
        THE_CAMP_PW,
    } = process.env;

    //훈련병 목록을 .trainees.json 에서 가져와 파싱 후 목록 출력
    let trainees = await fs.readFile('.trainees.json');
    trainees = JSON.parse(trainees);
    console.log(trainees);

    //훈련병 배열 생성
    const soldiers = trainees.map(({ name, birth, enter, unit, title_prefix }) => {
        return {
            title_prefix: title_prefix || '',
            object: new thecamp.Soldier(
                name,
                birth,
                enter,
                '예비군인/훈련병',
                '육군',
                unit,
                thecamp.SoldierRelationship.FRIEND,
            )
        }
    });

    //클라이언트 생성 후 더캠프 로그인
    const client = new thecamp.Client();
    await client.login(THE_CAMP_ID, THE_CAMP_PW);

    //뉴스 기사 가져오고 콘솔에 출력
    const news = await getNews();
    console.log(news);

    //편지 제목 및 내용 설정
    const date = new Date();
    const title_suffix = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}시 작성`;
    let body = news;

    //훈련병 모두에게 편지 전송
    for (let soldier of soldiers) {
        //부대에 따라 훈련병 소속/이름을 제목에 넣어야 하는 곳이 있음
        const title = (soldier.title_prefix === '') ? title_suffix : `${soldier.title_prefix}(${title_suffix})`; 
        await client.addSoldier(soldier.object);
        const [trainee] = await client.fetchSoldiers(soldier.object);
        const message = new thecamp.Message(title, body, trainee);
        await client.sendMessage(soldier.object, message);
    }
};

export default Send;