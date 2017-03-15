type ResFunctions<T> = {
    [P in keyof T]: (param: T[P]) => Promise<T[P]> | T[P]
};

export default function messenger<T>(responces: ResFunctions<T>) {
    return req;

    function req<K extends keyof T>(command: K, params: T[K]): Promise<T[K]> {
        const res = responces[command];
        if (!res) throw new Error(`responce of ${command} is not registered.`);

        return Promise.resolve(res(params));
    };
}

export function reqMock(_command: string, params: any) {
    return Promise.resolve(params);
}


/*
# example

const req = messenger({
    command: (n: number) => n + 10
});

req('command', 1).then((v) => {
    console.log(v);
});
*/
