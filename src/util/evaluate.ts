// Source: http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/

export interface ErrorOrData<T> {
    error: Error,
    data: T
}

export default function evaluate<T>(promise: Promise<T>) {
    return promise.then((data: T) => {
        return [null, data];
    })
        .catch((err) => [err, null]);
}

