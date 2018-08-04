import {spawn, ChildProcess, SpawnOptions} from "child_process";


export class PythonChild {
    /**
     * A name that will be used for log messages.
     */
    public logName: string;

    /**
     * An instance of the child process.
     */
    private _childProcess: ChildProcess;

    /**
     * An instance of the child process.
     */
    public get process(): ChildProcess {
        return this._childProcess;
    }

    /**
     * @param logName
     * A name that will be used for log messages.
     * Defaults to `child process`.
     */
    constructor(logName: string = "child process") {
        this.logName = logName;
        this._childProcess = undefined;
    }

    /**
     * Creates a child process through `child_process.spawn()` function and binds to it custom events.
     */
    public createProcess(command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): ChildProcess {
        this._childProcess = spawn(command, args, options);
        this.bindEvents(this._childProcess);

        return this._childProcess;
    }

    /**
     * Binds event listeners for child process.
     */
    protected bindEvents(process: ChildProcess): void {
        /* Process events. */

        process.on("close", (code, signal) => {
            console.log(`${this.logName} closed with code "${code}" and signal "${signal}".`);
        });

        process.on("disconnect", () => {
            console.log(`${this.logName} disconnected.`);
        });

        process.on("error", (err) => {
            console.error(`\n${this.logName} error:\n`, err, "\n");
        });

        process.on("exit", (code, signal) => {
            console.log(`${this.logName} exited with code "${code}" and signal "${signal}".`);
        });

        /* Process StdErr events. */

        process.stderr.on("close", () => {
            console.log(`${this.logName}, stderr: closed.`);
        });

        process.stderr.on("data", (data) => {
            console.log(`${this.logName}, stderr:\n${data.toString()}`);
        });

        /* Process StdIn events. */

        process.stdin.on("close", () => {
            console.log(`${this.logName}, stdin: closed.`);
        });

        /* Process StdOut events. */

        process.stdout.on("close", () => {
            console.log(`${this.logName}, stdout: closed.`);
        });
    }
}
