import * as brace from 'brace';

// cdnから読み込んでいるためglobalにしている
/* tslint:disable:class-name */
declare global {
    let ace: typeof brace;
    namespace ace {
        interface Editor extends brace.Editor { }
    }
}
/* tslint:eable:class-name */
