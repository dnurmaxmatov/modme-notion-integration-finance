import axios from "axios";
import 'dotenv/config.js'
import { getModmeInforms } from "./getModmeInforms.js";
import { createPageNotion } from "./createPageNotion.js";


export const writeToNotion = async (date) => {
    try {
        let dateLocal = date;
        const modInforms = await getModmeInforms(dateLocal);
        const pageId = await createPageNotion(dateLocal)
        let { Cash, UZCARD, Payme, Click, Uzum, UzumBank, Humo } = modInforms.all
        await axios.patch(`https://api.notion.com/v1/pages/${pageId}`, {
            properties: {
                Click: { "number": Click.totals },
                Humo: { "number": Humo.totals },
                "Naqd pul kirimi": { "number": Cash.totals },
                Uzcard: { "number": UZCARD.totals },
                Uzum: { "number": Uzum.totals + UzumBank.totals },
                Payme: { "number": Payme.totals },
                "Pul ko'chirish": { "number": modInforms.all["Bank account"].totals }
            }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.SECRET}`,
                'Notion-Version': process.env.NOTION_VERSION
            }
        })
    } catch (error) {
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

