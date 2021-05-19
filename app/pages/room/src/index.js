import { constants } from "../../_shared/constants.js";
import RoomSocketBuilder from "./util/roomScoket.js";

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room,
});

const socket = socketBuilder
    .setOnUserConnected(user => console.log('User Connected', user))
    .setOnUserDisconnected(user => console.log('User Disconnected', user))
    .setOnRoomUpdated(room => console.log('Room updated', room))
    .build();

const room = {
    id: '001',
    topic: 'JS Expert',
};

const user = {
    img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/pilot_traveller_person_avatar-256.png',
    username: 'Gabriel',
};

socket.emit(constants.events.JOIN_ROOM,  {user, room});
