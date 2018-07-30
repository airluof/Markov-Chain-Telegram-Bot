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
    if (!req.body) {
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
    console.log(req.body.message);
    res.sendStatus(200);
};
