import axios from 'axios';
import 'dotenv/config.js'
import moment from 'moment';

export const createPageNotion = async (date) => {
    try {
        const getPage = await axios.post(`https://api.notion.com/v1/databases/${process.env.DATABASE_ID}/query`, {
            filter: {
                property: "Date",
                date: {
                    equals: date
                }
            }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.SECRET}`,
                "Notion-Version": process.env.NOTION_VERSION
            }
        })

        if (getPage.data && getPage.data.results.length == 0) {
            const page = await axios.post(`https://api.notion.com/v1/pages`, {
                parent: { database_id: process.env.DATABASE_ID },
                properties: {
                    Date: {
                        type: "date",
                        date: {
                            start: date
                        }
                    },
                    "Name": {
                        "title": [
                            {
                                "text": {
                                    "content": moment(date).format('DD.MM.YYYY')
                                }
                            }
                        ]
                    },
                }
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.SECRET}`,
                    "Notion-Version": process.env.NOTION_VERSION
                }
            })

            return page.data.id
        } else if (getPage.data && getPage.data.results.length > 0) {
            return getPage.data.results[0].id
        }
    } catch (error) {
        console.log(error.message)
        axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.CHAT_ID,
                text: `*Notionda page yaartishda yoki uning ID sini olishda xatolik*\n\n${error}`,
                parse_mode: "Markdown"
            }
        );
    }
}