export default class Attendee {
    constructor({ id, username, img }){
        this.id = id;
        this.username = username || 'Anônimo';
        this.img = img;
    }
}