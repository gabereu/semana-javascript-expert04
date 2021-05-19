import View from "../../_shared/View.js";
import Room from "./entities/room.js";
import getLobbiItemTemplate from "./templates/lobbyItemTemplate.js"

const roomGrid = document.getElementById('roomGrid');
const btnCreateRoomWithTopic = document.getElementById('btnCreateRoomWithTopic');
const btnCreateRoomWithoutTopic = document.getElementById('btnCreateRoomWithoutTopic');
const txtTopic = document.getElementById('txtTopic');

export default class LobbyView extends View {

    static generateRoomLink({ id, topic }){
        return `./../room/index.html?id=${id}&topic=${topic}`
    }

    static updateRoomList(rooms){
        const roomsHTML = rooms.map(roomData => {
            const room = new Room({
                ...roomData,
                roomLink: LobbyView.generateRoomLink(roomData)
            });
            return getLobbiItemTemplate(room);
        }).join('');
        roomGrid.innerHTML = roomsHTML;
    }

    static redirectRoom(topic=''){
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const link = LobbyView.generateRoomLink({ id: uniqueId, topic });
        window.location = link;
    }

    static configureCreateRoomButton(){
        btnCreateRoomWithTopic.addEventListener('click', () => {
            const topic = txtTopic.value;
            LobbyView.redirectRoom(topic);
        });
        btnCreateRoomWithoutTopic.addEventListener('click', () => {
            LobbyView.redirectRoom();
        });
    }
}