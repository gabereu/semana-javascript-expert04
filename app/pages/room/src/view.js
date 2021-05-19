import View from "../../_shared/View.js";
import Attendee from "./entities/Attendee.js";
import getAttendeeTemplate from "./templates/attendeeTemplate.js";

const roomTopic = document.getElementById('pTopic');
const speakerGrid = document.getElementById('gridSpeakers');
const attendeeGrid = document.getElementById('gridAttendees');

export default class RoomView extends View {

    static updateRoomTopic({ topic }){
        roomTopic.innerHTML = topic;
    }

    static updateAttendeesOnGrid(attendees){
        speakerGrid.innerHTML = '';
        attendeeGrid.innerHTML = '';
        attendees.forEach(RoomView.addAttendeeOnGrid);
    }

    static addAttendeeOnGrid(attendeeData){
        const attendee = new Attendee(attendeeData);
        
        const htmlTemplate = getAttendeeTemplate(attendee);
        const grid = attendee.isSpeaker ? speakerGrid : attendeeGrid;

        const existingAttendee = RoomView._getAttendeeElementOnGrid(attendeeData);
        if(existingAttendee){
            existingAttendee.innerHTML = htmlTemplate;
            return;
        }

        grid.innerHTML += htmlTemplate;
    }

    static _getAttendeeElementOnGrid(attendeeData) {
        const attendee = new Attendee(attendeeData);
        return document.getElementById(`Attendee_Id_${attendee.id}`);
    }

    static removeAttendeeOnGrid(attendeeData){
        const attendeeItem = RoomView._getAttendeeElementOnGrid(attendeeData);
        attendeeItem?.remove();
    }
}