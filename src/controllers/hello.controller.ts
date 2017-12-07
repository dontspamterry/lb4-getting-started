import {get} from '@loopback/rest';

export class HelloController {

    @get('hello')
    get(): string {
        return 'Hello World';
    }
}