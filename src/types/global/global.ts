import * as Types from '@shared';
import * as brace from 'brace';

// cdnから読み込んでいるためglobalにしている
/* tslint:disable:class-name no-var-keyword */
declare global {
    var ace: typeof brace;
    namespace ace {
        interface Editor extends brace.Editor { }
    }
    var $idb: Types.IDB.Instance;
}
/* tslint:eable:class-name */
