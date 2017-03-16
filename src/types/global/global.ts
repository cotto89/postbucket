import * as Types from '@shared';
import * as brace from 'brace';
import { History } from 'history';

// cdnから読み込んでいるためglobalにしている
/* tslint:disable:class-name no-var-keyword */
declare global {
    var ace: typeof brace;
    namespace ace {
        interface Editor extends brace.Editor { }
    }
    var $idb: Types.IDB.Instance;
    var $history: History;
}
/* tslint:eable:class-name */
