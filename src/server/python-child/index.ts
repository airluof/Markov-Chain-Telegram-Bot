import {spawn, ChildProcess, SpawnOptions} from "child_process";


export class PythonChild {
    public logName: string;
    private _childProcess: ChildProcess;

    public get process(): ChildProcess {
        return this._childProcess;
    }

    constructor(logName: string = "child process") {
        this.logName = logName;
        this._childProcess = undefined;
    }

    public createProcess(command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): ChildProcess {
        this._childProcess = spawn(command, args, options);
        this.bindEvents(this._childProcess);

        return this._childProcess;
    }

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
