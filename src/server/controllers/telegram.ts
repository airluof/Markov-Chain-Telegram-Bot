import axios from "axios";
import {CustomController} from "../types/index"


/**
 * Controller for 405 error.
 *
 * Sends status 405 and custom error response.
 */
export const methodNotAllowed: CustomController = (req, res) => {
    res.status(405);
    res.json({status: false, code: res.statusCode});
};


export const webHook: CustomController = (req, res) => {
    if (!req.body || !Object.keys(req.body).length) {
        res.status(400);
        res.json({status: false, code: res.statusCode});
        return;
    }

    if (req.body.message) {
        message(req, res);
    } else {
        console.warn("Unhandled Telegram request type.");
        console.log(req.body);
        res.sendStatus(200);
    }
};


const message: CustomController = (req, res) => {
    if (req.body.message.text) {
        messagePlainText(req, res);
    } else {
        console.warn("Telegram Message request doesn't contains a plain text.");
        res.sendStatus(200);
    }
};


const messagePlainText: CustomController = (req, res) => {
    generateMarkovChain(req, res);
};


const generateMarkovChain: CustomController = async (req, res) => {
    // Generation can take a long time.
    // So, we send to Telegram that we received the message and handle it.
    // If we don't send `OK` response, then Telegram
    // will be send a message over and over again.
    res.sendStatus(200);

    /**
     * @see https://core.telegram.org/bots/api#sendmessage
     */
    const sendOptions: any = {
        chat_id: req.body.message.chat.id
    };

    try {
        sendOptions.message = await req.app.locals.MarkovChain.generate(req.body.message.text);
    } catch (error) {
        sendOptions.parse_mode = "Markdown";
        sendOptions.message = "*Ошибка.*";
        console.error(error);
    }

    axios.post(`${process.env.BOT_API}${process.env.BOT_TOKEN}/sendMessage`, sendOptions)
    .then((res) => {
        console.log(`Message for ${req.body.message.chat.username} is sended: ${sendOptions.message}`);
    })
    .catch((err) => {
        console.error(err);
    });
};
