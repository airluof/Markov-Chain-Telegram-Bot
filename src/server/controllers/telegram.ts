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
    if (req.body.message.entities) {
        messageEntities(req, res);
    } else if (req.body.message.text) {
        messagePlainText(req, res);
    } else {
        console.warn("Telegram Message request doesn't contains any appropriate data.");
        console.warn(req.body.message);
        res.sendStatus(200);
    }
};


/**
 * Handles Telegram Message that contains an entities.
 */
const messageEntities: CustomController = (req, res) => {
    const text = req.body.message.text;

    for (let entity of req.body.message.entities) {
        if (entity.type === "bot_command") {
            messageCommand(
                text.slice(entity.offset, entity.offset + entity.length),
                req.body.message.chat.id
            );
        }
    }

    res.sendStatus(200);
};


/**
 * Handles Bot Command.
 *
 * @param command A text command (with `/` sign).
 * @param chat_id From what chat received. Used for response.
 *
 * @example Command - `/start`
 */
const messageCommand = async (command: string, chat_id: number): Promise<void> => {
    /**
     * @see https://core.telegram.org/bots/api#sendmessage
     */
    const sendOptions: any = {
        chat_id: chat_id
    };
    const url = `${process.env.BOT_API}${process.env.BOT_TOKEN}/sendMessage`;

    switch (command) {
        case "/start": {
            sendOptions.text = "Start";

            try {
                await axios.post(url, sendOptions);
            } catch (error) {
                console.error(error);
            }

            break;
        }

        case "/help": {
            sendOptions.text = "Help";

            try {
                await axios.post(url, sendOptions);
            } catch (error) {
                console.error(error);
            }

            break;
        }

        default: {
            console.warn(`Unknown command - ${command}`);
            break;
        }
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
