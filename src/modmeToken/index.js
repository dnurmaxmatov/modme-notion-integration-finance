import fs from 'fs'
import 'dotenv/config.js'
import path from 'path';
import axios from 'axios'
import schedule from 'node-schedule'
import { writeToNotion } from '../functions/writeToNotion.js';


export async function modmeToken() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'modmeToken', 'token.json')
        const token_modme = await axios.post(
            `${process.env.DOMAIN_MODME}/v1/auth/login`,
            {
                phone: process.env.MODME_LOGIN,
                password: process.env.MODME_PASS,
                relation_degree: 1,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Referer: process.env.MODME_REFERER,
                },
            }
        );
        if (token_modme.status == 200 && token_modme.data) {
            fs.writeFileSync(filePath, JSON.stringify({
                access_token: token_modme.data.access_token
            }))
        }
    } catch (error) {
        axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.CHAT_ID,
                text: `*Modme tokeni almashmadi*\n\n${error}`,
                parse_mode: "Markdown"
            }
        );
    }
}


schedule.scheduleJob('0 */4 * * *', async () => {
    modmeToken()
})

schedule.scheduleJob('*/10 * * * *', async () => {
    writeToNotion()
})







