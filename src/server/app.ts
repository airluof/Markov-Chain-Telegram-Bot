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

import {PythonChild} from "./python-child/index";

const MarkovChain = new PythonChild("markov child process");
MarkovChain.createProcess("python3", ["./src/markov-chain/main.py"], {env: {"LC_ALL": "en_US.UTF-8"}});

// set up for usage in other scripts.
app.locals.MarkovChain = MarkovChain;


/* Express APP. */

export default app;
