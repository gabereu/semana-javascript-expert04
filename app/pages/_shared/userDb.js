import { constants } from "./constants.js";

const FIELD = constants.storageKey;

export default class UserDb {
    static insert(data){
        localStorage.setItem(FIELD, JSON.stringify(data));
    }

    static get(){
        const result = localStorage.getItem(FIELD);

        return JSON.parse(result || '{}');
    }

    static hasUser(){
        const userAlreadyDefined = UserDb.get();
        return !!Object.keys(userAlreadyDefined).length;
    }
}