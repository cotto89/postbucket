declare module "lodash/fp/set" {
    function set<T>(path: string | string[], value: any, object: T): T
    export = set;
}