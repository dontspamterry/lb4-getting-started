import {get, param} from '@loopback/rest';
import {HttpErrors} from '@loopback/rest';

import * as createHttpError from 'http-errors';

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const exceptions: Error[] = [
    new SyntaxError("fake syntax error"),
    new TypeError("fake type error"),
    new ReferenceError("fake reference error")
];

export class HelloController {

    @get('hello')
    @param.query.boolean('crapOut')
    hello(crapOut: boolean = false): string {
        let tempBool: boolean = new Boolean(crapOut).valueOf();

        if (tempBool === true) {
            throw new createHttpError.BadRequest('/hello crapOut error');
        }

        return 'Hello World';
    }

    @get('throw')
    throwRandom(): void {
        let idx = getRandomInt(0, exceptions.length);
        let e = exceptions[idx];
        throw e;
    }
}