import {CustomRequest as CRequest} from "./request";
import {CustomResponse as CResponse} from "./response";
import {CustomController as CController} from "./controller";
import {PythonChild as PythnChld} from "./PythonChild";


export type CustomRequest = CRequest;
export interface CustomResponse extends CResponse {}
export type CustomController = CController;
export interface PythonChild extends PythnChld {}
