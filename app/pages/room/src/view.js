import { constants } from "../../_shared/constants.js";
import View from "../../_shared/View.js";
import Attendee from "./entities/Attendee.js";
import getAttendeeTemplate from "./templates/attendeeTemplate.js";

const roomTopic = document.getElementById('pTopic');
const speakerGrid = document.getElementById('gridSpeakers');
const attendeeGrid = document.getElementById('gridAttendees');
const btnClipBoard = document.getElementById('btnClipBoard');
const btnMicrophone = document.getElementById('btnMicrophone');
const btnClap = document.getElementById('btnClap');
const toggleImage = document.getElementById('toggleImage');
const btnLeave = document.getElementById('btnLeave');

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

    static showUserFeatures({ isSpeaker }){
        if(!isSpeaker){
            btnClipBoard.classList.add('hidden');
            btnMicrophone.classList.add('hidden');
            btnClap.classList.remove('hidden');
            return;
        }
        btnClap.classList.add('hidden');
        btnClipBoard.classList.remove('hidden');
        btnMicrophone.classList.remove('hidden');
    }

    static renderAudioElement({ stream,isCurrentId}) {
        RoomView._createAudioElement({
            muted: isCurrentId,
            srcObject: stream,
        });
    }

    static _createAudioElement({ muted = true, srcObject }){
        const audio = document.createElement('audio');
        audio.muted = muted;
        audio.srcObject = srcObject;
        audio.addEventListener('loadedmetadata', async () => {
            try {
                await audio.play();
            } catch (error) {   
                console.error('Error to play', error);
            }
        });

        return audio;
    }

    static configureClapButton(command){
        btnClap.addEventListener('click', RoomView._onClapClick(command))
    }

    static configureLeaveButton(){
        btnLeave.addEventListener('click', () => RoomView._redirectToLobby())
    }

    static _redirectToLobby(){
        window.location = constants.pages.lobby;
    }

    static configureMuteButton(command){
        btnMicrophone.addEventListener('click', () => {
            command();
            RoomView._toogleMicrophoneIcon();
        });
    }

    static _toogleMicrophoneIcon() {
        const icon = btnMicrophone.firstElementChild;
        const classes = [...icon.classList]

        const inactiveMicrophoneClass = 'fa-microphone-slash';
        const activeMicrophoneClass = 'fa-microphone';

        const microphoneIsInactive = classes.includes(inactiveMicrophoneClass);

        if(microphoneIsInactive) {
            icon.classList.remove(inactiveMicrophoneClass)
            icon.classList.add(activeMicrophoneClass)
            return;
        }

        icon.classList.remove(activeMicrophoneClass)
        icon.classList.add(inactiveMicrophoneClass)

    }

    static _onClapClick(command){
        return () => {
            command()
            const basePath = './../../assets/icons/';
            const handInactive = 'hand.svg';
            const handActive = 'hand-solid.svg';

            if (toggleImage.src.match(handInactive)){
                toggleImage.src = basePath + handActive;
            } else {
                toggleImage.src = basePath + handInactive;
            }
        }
    }
}