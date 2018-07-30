import {Router} from "express";
import {error404} from "../controllers/error";


const router = Router();


router.use("*", error404); // 404, keep this as the last route.


export default router;
