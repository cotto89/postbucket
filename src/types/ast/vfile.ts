/*
[vfile/vfile: Virtual file format for text processing]
(https://github.com/vfile/vfile)

version: 2.0.0
*/
export interface VFile {
    contents: string | null | Buffer;
    cwd: string;
    path?: string;
    basename?: string;
    stem?: string;
    extname?: string;
    history: string[];
    message: VFileMessage[];
    data: any;
    toString(encode?: string): string;
}

export interface VFileMessage {
    file: string;
    reason: string;
    ruleId?: string;
    source?: string;
    stack?: string;
    fatal?: boolean;
    line?: number;
    column?: number;
    location: any;
}
