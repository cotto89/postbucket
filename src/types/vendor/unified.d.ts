/*
[wooorm/unified: ☔ Text processing umbrella: Parse / Transform / Compile](https://github.com/wooorm/unified#processoruseplugin-options)

version: 6.0.1
*/

declare module 'unified' {
    export = processor

    /* processor function */
    function processor<T>(): Processor<T>;

    namespace processor {
        export interface File extends VFile.VFile { }

        export type Next = <T>(err: Error, tree: T, file: File) => void

        /**
         * 3種類のplugin
         * - parserやcompilerを変更したり、他のprocessorとつながるような、processor自体の働きを変えるplugin
         * - syntax treeの構造をtransfromするplugin
         * - fileのmetadataを変更するplugin
         */
        export interface Plugin<T, U> extends Attacher<T, U> { }

        /**
         * attacherはuse()に渡され、processorを構成する
         * optionsを受け取ることが可能
         * optionによりprocessorの構成や機能に手を加えたり、
         * transformerを返すことでastに触ることができる
         */
        export interface Attacher<T, U> {
            (options?: U): Transformer<T> | undefined
        }

        /**
         * Transformerはsyntax tree や metadata に変更を加える。
         * transformeはtransformフェーズに入ったときにflie毎に毎回実行される関数である
         * もしerrorが起きた場合はprocessは止まる。その場合nextが呼ばれる
         * processorに async pluginを持つ場合はnextで受ける必要がある(?)
         */
        export interface Transformer<T> {
            (tree: T, file: File, next?: Next): T | Promise<T> | Error | void
        }

        export class Compiler { }
        export class Parser { }

        export interface Processor<T> extends $Processor<T> { }
    }

    /* interface Processorのためにnamespace processorから書き出している */
    type Attacher<T, U> = processor.Attacher<T, U>
    type Plugin<T, U> = processor.Plugin<T, U>
    type Transformer<T> = processor.Transformer<T>

    // type Tree = processor.Tree;
    type File = processor.File;
    type Next = processor.Next;


    // interface Processorをnamespace processorに含めるためにやってる
    interface $Processor<T> extends Processor<T> { }


    /* processor functionが持っているmenber function */
    interface Processor<T> {
        /**
         * Configure the processor to use a plug-in,
         * and configure that plug-in with optional options.
         */
        use<U extends T, O>(plugin: Plugin<T, O>, options?: O): Processor<U>;
        use<U extends T, O>(plugins: Plugin<T, O>[], options?: O): Processor<U>;
        use<U extends T>(processor: Processor<T>): Processor<U>;


        /**
         * Parse text to a syntax tree.
         * processor.Parserにsetされたparserを使ってsyntax treeを作る
         */
        parse<U extends T, O>(value: string): U;
        parse<U extends T>(file: File): U;


        /**
         * Compile a syntax tree to text.
         * processor.Compilerにsetされたcompilerを使ってsyntax treeからstringを作る
         * setするCompilerによって吐き出されるのもは変わる
         */
        stringify<O>(tree: T): string;
        stringify<O>(tree: T, file?: File): string;


        /**
         * Transform a syntax tree by applying plug-ins to it with asycn
         * doneが存在しない場合はPromise<Tree>を返す
         * doneが存在する場合はvoidを返す
         */
        run<U extends T>(tree: T): Promise<T>;
        run<U extends T>(tree: T, done?: (err: Error, tree: T, file: File) => void): void;
        run<U extends T>(tree: T, file?: File, done?: (err: Error, tree: T, file: File) => void): void;

        /**
         * Transform a syntax tree by applying plug-ins to it with sync
         * async pluginが含まれている場合は例外が投げられる
         */
        runSync<U extends T>(tree: T): U;
        runSync<U extends T>(tree: T, file?: File): U;

        /**
         * The process invokes parse, run, and stringify internally with async
         * async pluginが含まれている場合は例外が投げられる
         */
        process(value: string): Promise<File>;
        process(value: string, done?: (err: Error, file: File) => void): void;
        process(file: File): Promise<File>;
        process(file: File, done?: (err: Error, file: File) => void): void;

        /**
         * The process invokes parse, run, and stringify internally with sync
         */
        processSync(value: string): File;
        processSync(file: File): File


        /**
         * あらかじめpluginやcompler, parserが含まれたprocessorを作る
         *
         * Example:
         * const processor = unified().use([html, parse]).freeze();
         * processor().process('# hello world');
         *
         * 予め特定のparserやcompilerを所有したprocessorを作る。
         * layerはunifiedと同じで必ず関数呼び出ししないといけない。
         * processor().use(attacher).process('# hello world')みたいにさらにpluginを咬ませることができる
         *
         */
        freeze(): typeof processor


        /*
            使わなそうなので保留
            pipe(): any;
            write(): any;
            end(): any;
            data(): any;
        */
    }


    /* VFile
    ----------------------------- */
    namespace VFile {
        interface VFile {
            contents: string | null | Buffer;
            cwd: string;
            path?: string;
            basename?: string;
            stem?: string;
            extname?: string;
            history: string[];
            message: VFileMessage[];
            data: any;
            toString(encode?: string): string
        }


        interface VFileMessage {
            file: string;
            reason: string;
            ruleId?: string;
            source?: string;
            stack?: string;
            fatal?: boolean;
            line?: number;
            column?: number;
            location: any
        }

    }
}