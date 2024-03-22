import axios from 'axios'
import 'dotenv/config.js'
import path from 'path'
import fs from 'fs'

export const getModmeInforms = async (date) => {
    try {
        const filePath = path.join(process.cwd(), "src", "modmeToken", "token.json");
        let data = fs.readFileSync(filePath, "utf-8", null);
        let token = JSON.parse(data)['access_token']
        const informs = await axios.get(`${process.env.DOMAIN_MODME}/v1/replenishments/profit?branch_id=${process.env.BRANCH_ID}&to=${date}&from=${date}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Referer": process.env.MODME_REFERER
                }
            }
        )

        console.log(informs.data);
        return informs.data

    } catch (error) {
        console.log(error.message)
        axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.CHAT_ID,
                text: `*Modmedan ma'lumotlarni olib bo'lmadi *\n\n${error}`,
                parse_mode: "Markdown"
            }
        );
    }
}