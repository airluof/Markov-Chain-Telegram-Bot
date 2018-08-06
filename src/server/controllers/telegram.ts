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


/**
 * Gets a WebHook from Telegram and handles it.
 *
 * Sends status 400 and custom error response if request doesn't contain a body.
 */
export const webHook: CustomController = (req, res) => {
    if (!req.body || !Object.keys(req.body).length) {
        res.status(400);
        res.json({status: false, code: res.statusCode});
        return;
    }

    if (req.body.message) {
        message(req, res);
    } else {
        console.warn("Unhandled request type.");
        console.warn(req.body);
        res.sendStatus(200);
    }
};


/**
 * Handles Telegram Message request.
 */
const message: CustomController = (req, res) => {
    if (req.body.message.text) {
        messagePlainText(req, res);
    } else {
        console.warn("Telegram Message request doesn't contains a plain text.");
        res.sendStatus(200);
    }
};


/**
 * Handles Telegram Message that contains a plain text.
 */
const messagePlainText: CustomController = (req, res) => {
    generateMarkovChain(req, res);
};


/**
 * Generates a text and sends it as a response to the Telegram Message.
 */
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
        chat_id: process.env.NODE_ENV === "development" ? "dev" : req.body.message.chat.id
    };

    try {
        sendOptions.text = await req.app.locals.MarkovChain.generate(req.body.message.text);
    } catch (error) {
        sendOptions.parse_mode = "Markdown";
        sendOptions.text = "*Ошибка.*";
        console.error(error);
    }

    let url: string = undefined;

    // if development, then send to local computer.
    if (process.env.NODE_ENV === "development") {
        url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        sendOptions.whatisit = "It is a generated message in response to your POST request.";
        sendOptions.wherefrom = "Sended by server to itself.";
    } else {
        url = `${process.env.BOT_API}${process.env.BOT_TOKEN}/sendMessage`;
    }

    axios.post(url, sendOptions)
    .then((res) => {
        const username = process.env.NODE_ENV === "development" ? "dev" : req.body.message.chat.username;
        console.log(`Message for ${username} is sended: ${sendOptions.text}`);
    })
    .catch((err) => {
        console.error(err);
    });
};
