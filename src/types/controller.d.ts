import {CustomRequest} from "./request";
import {CustomResponse} from "./response";


export type CustomController = (req: CustomRequest, res: CustomResponse) => void;
