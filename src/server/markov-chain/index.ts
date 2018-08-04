import {PythonChild} from "./../python-child/index";


/**
 * Creates Python child process for Markov Chain generation.
 * Will be available through `app.locals.MarkovChain.generate()`.
 *
 * @param app An app for local variables binding.
 */
export function create(app) {
    const MarkovChain = new PythonChild("markov child process");

    MarkovChain.createProcess(
        "python3",
        ["./src/markov-chain/main.py"],
        // Overrides all process.env variables in order to make it unavailable for Python scripts.
        // `"LC_ALL": "en_US.UTF-8"` sets `UTF-8` encoding for script in order to support non ASCII symbols.
        {env: {"LC_ALL": "en_US.UTF-8"}}
    );

    app.locals.MarkovChain = {
        // Stores unhandled generation requests.
        promises: [],

        /**
         * Sends a command to Python script to generate a text.
         *
         * @param text A start of the output text.
         * @see https://github.com/Amaimersion/Markov-Chain#args-2
         */
        generate: (text: string = ""): Promise<string> => {
            return new Promise(async (resolve) => {
                let rslv = undefined;
                let rjct = undefined;

                const generationPromise = new Promise((res, rej) => {
                    rslv = res;
                    rjct = rej;
                });

                app.locals.MarkovChain.promises.push({
                    promise: generationPromise,
                    resolve: rslv,
                    reject: rjct
                });

                // Send a command.
                // `\n` at the end signals that no more data will be written to the
                // Writable stream and data can be emitted (equivalent to `writable.end()`).
                MarkovChain.process.stdin.write(`${text}\n`);

                const lastIndex = app.locals.MarkovChain.promises.length - 1;
                const data = await app.locals.MarkovChain.promises[lastIndex].promise;

                return resolve(data);
            });
        }
    }

    MarkovChain.process.stderr.on("data", (data) => {
        app.locals.MarkovChain.promises.shift().reject(data.toString());
    });

    MarkovChain.process.stdout.on("data", (data) => {
        app.locals.MarkovChain.promises.shift().resolve(data.toString());
    });
}
