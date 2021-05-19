import Attendee from "./attendee.js";

export default class Room {
    constructor({ attendeesCount, featuredAttendees=[], id, owner, speakersCount, topic, subTopic, roomLink }) {

        this.id = id;
        this.featuredAttendees = featuredAttendees.map(attendee => new Attendee(attendee));
        this.owner = new Attendee(owner);
        this.subTopic = subTopic || 'Semana JS Expert 4.0';
        this.attendeesCount = attendeesCount;
        this.speakersCount = speakersCount;
        this.topic = topic;
        this.roomLink = roomLink;
    }
}