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
    let message = "";

    req.app.locals.MarkovChainGenerate().then((data) => {
        message = data;
        res.send(message); // only in dev.
    }).catch(() => {
        message = "Ошибка.";
        res.send(message); // only in dev.
    });

    return; // only in dev.

    axios.post("https://api.telegram.org/<bot>/sendMessage", {
        chat_id: req.body.message.chat.id,
        text: message
    }).then((res) => {
        console.log("Message sended", message);
    }).catch((err) => {
        console.error(err);
    });

    res.sendStatus(200);
};
