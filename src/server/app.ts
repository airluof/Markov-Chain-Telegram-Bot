/* ENV Variables. */

import * as dotenv from "dotenv";

dotenv.config()


/* Express app. */

import * as express from "express";

const app = express();


/* Middlewares. */

import * as helmet from "helmet";
import * as lusca from "lusca";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";

app.use(helmet());
app.use(lusca.xssProtection(true));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));


/* Routes. */

import telegramRouter from "./routes/telegram";
import errorRouter from "./routes/error";

app.use("/telegram", telegramRouter);
app.use("*", errorRouter); // 404, keep this as the last route.


/* Python child process for Markov Chain generation. */

import {create} from "./markov-chain";

create(app);


/* Express APP. */

export default app;
