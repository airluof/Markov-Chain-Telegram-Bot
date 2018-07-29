import {CustomController} from "../types/index"


/**
 * Controller for 404 error.
 *
 * Sends status 404 and custom error response.
 */
export const error404: CustomController = (req, res) => {
    res.status(404);
    res.json({status: false, code: res.statusCode});
};
