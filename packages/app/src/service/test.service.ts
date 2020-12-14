import { BaseService } from '@umajs-express/core';


export default class test extends BaseService {
    returnFrameName() {
        return 'Umajs';
    }
}