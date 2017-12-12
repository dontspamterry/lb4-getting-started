// Source: http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/

export default function to<T>(promise: Promise<T>) {
    return promise.then((data: T) => {
        return [null, data];
    })
        .catch(err => [err, null]);
}