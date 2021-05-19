import { constants } from "../../../_shared/constants.js";
import SocketBuilder from "../../../_shared/SocketBuilder.js";

export default class RoomSocketBuilder extends SocketBuilder{

    constructor({ socketUrl, namespace }) {
        super({ socketUrl, namespace });
        this.onRoomUpdated = () => {};
        this.onUserProfileUpdated = () => {};
    }

    setOnRoomUpdated(fn){
        this.onRoomUpdated = fn;

        return this;
    }

    setOnUserProfileUpdated(fn) {
        this.onUserProfileUpdated = fn;

        return this;
    }

    build(){
        const socket = super.build();

        socket.on(constants.events.ROOM_UPDATED, this.onRoomUpdated.bind(this));
        socket.on(constants.events.UPGRADE_USER_PERMISSION, this.onUserProfileUpdated.bind(this));

        return socket;
    }
}