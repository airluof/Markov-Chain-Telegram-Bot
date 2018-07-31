import {ChildProcess, SpawnOptions} from "child_process";


export interface PythonChild {
    logName: string;
    process: ChildProcess;
    createProcess(command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): ChildProcess;
}
