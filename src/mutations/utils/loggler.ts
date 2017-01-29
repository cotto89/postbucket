export function logger(s: AppState, payload: any) {
    /* tslint:disable:no-console */
    console.groupCollapsed('LOGGER');
    console.log(payload);
    console.log(s);
    console.groupEnd();
    /* tslint:enable:no-console */
}
