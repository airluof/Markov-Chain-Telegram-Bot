import {Response} from "express";


type SuccessSend = (
    /**
     * Status of response.
     */
    status: true
) => Response;

type ErrorSend = (
    /**
     * Status of response.
     */
    status: false,

    /**
     * Code of error.
     */
    code: number
) => Response;


interface Success {
    json: SuccessSend;
}

interface Error {
    json: ErrorSend;
}


export type CustomResponse = Response & Success & Error;
