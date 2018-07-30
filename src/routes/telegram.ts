import {Router} from "express";
import {methodNotAllowed, webHook} from "../controllers/telegram";


const router = Router();


router.get("*", methodNotAllowed);
router.post("*", webHook);


export default router;
