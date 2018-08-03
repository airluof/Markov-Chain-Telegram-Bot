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

import {PythonChild} from "./python-child/index";

const MarkovChain = new PythonChild("markov child process");
MarkovChain.createProcess("python3", ["./src/markov-chain/main.py"], {env: {"LC_ALL": "en_US.UTF-8"}});

app.locals.Promises = [];

// set up for usage in other scripts.
app.locals.MarkovChainGenerate = () => {
    return new Promise(async (resolve) => {
        let res = undefined;

        const promise = new Promise((resolve) => {
            res = resolve;
        });

        app.locals.Promises.push({resolve: res, promise: promise})
        MarkovChain.process.stdin.write("\n");

        const data = await app.locals.Promises[0].promise;

        return resolve(data);
    });
};

MarkovChain.process.stdout.on("data", (data) => {
    app.locals.Promises.shift().resolve(data.toString());
});


/* Express APP. */

export default app;
