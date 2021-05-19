import Attendee from "../entities/Attendee.js";
const speakerIcon = '<img src="./../../assets/icons/asterisk.svg" alt="File icon" class="icon" />';

export default function getAttendeeTemplate(attendee = new Attendee()){
    return `
    <div class="room-card__user" id="Attendee_Id_${attendee.id}">
        <div class="room-card__user__img">
        <img src="${attendee.img}" alt="${attendee.username}">
        </div>
        <p class="room-card__user__name">
        ${attendee.isSpeaker ? speakerIcon : ""}
        ${attendee.firstName}
        </p>
    </div>
    `;    
}
