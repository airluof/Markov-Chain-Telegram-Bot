import {Router} from "express";
import {error404} from "../controllers/error";


const router = Router();


router.get("/", error404);


export default router;
