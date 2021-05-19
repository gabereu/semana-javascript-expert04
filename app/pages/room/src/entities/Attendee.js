export default class Attendee {
    constructor({ id, username, img, isSpeaker, roomId, peerId }){
        this.id = id;
        this.isSpeaker = isSpeaker;
        this.roomId = roomId;
        this.peerId = peerId;
        this.img = img || '';
        this.username = username || 'Anônimo';

        const [firstName, ...lastName] = this.username.split(/\s/);
        this.firstName = firstName;
        this.lastName = lastName;
    }
}