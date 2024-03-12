import axios from "axios";
import 'dotenv/config.js'
import mt from 'moment'
import { getModmeInforms } from "./getModmeInforms.js";
import { createPageNotion } from "./createPageNotion.js";


export const writeToNotion = async () => {
    try {
        let dateLocal = mt(Date.now()).format('YYYY-MM-DD');
        const modInforms = await getModmeInforms(dateLocal);
        const pageId = await createPageNotion(dateLocal)
        let { Cash, UZCARD, Payme, Click, Uzum, Humo } = modInforms.all
        await axios.patch(`https://api.notion.com/v1/pages/${pageId}`, {
            properties: {
                Click: { "number": Click.totals },
                Humo: { "number": Humo.totals },
                Income: { "number": Cash.totals },
                Uzcard: { "number": UZCARD.totals },
                Uzum: { "number": Uzum.totals },
                Payme: { "number": Payme.totals }
            }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.SECRET}`,
                'Notion-Version': process.env.NOTION_VERSION
            }
        })
    } catch (error) {
        console.log(error.message)
        axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.CHAT_ID,
                text: `*Notionga yozilmay qoldi*\n\n${error}`,
                parse_mode: "Markdown"
            }
        );
    }
}

