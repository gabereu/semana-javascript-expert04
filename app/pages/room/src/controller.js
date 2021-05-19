import { constants } from "../../_shared/constants.js";

export default class RoomCrontroller {
    constructor({ roomInfo, socketBuilder, view }) {
        this.socketBuilder = socketBuilder;
        this.roomInfo = roomInfo;
        this.socket = {};
        this.view = view;
    }

    async initialize() {
        this._setupViewEvents();
        this.socket = this._setupSocket();

        this.socket.emit(constants.events.JOIN_ROOM,  this.roomInfo);
    }

    _setupViewEvents(){
        this.view.updateUserImage(this.roomInfo.user);
        this.view.updateRoomTopic(this.roomInfo.room);
    }

    _setupSocket() {
        const socket = this.socketBuilder
            .setOnUserConnected(this._onUserConnected())
            .setOnUserDisconnected(this._onUserDisconnected())
            .setOnRoomUpdated(this._onRoomUpdate())
            .setOnUserProfileUpdated(this._onUserProfileUpdated())
            .build();

        return socket;
    }

    _onUserProfileUpdated(){
        return info => {
            switch (info.change) {
                case 'new Owner':
                case 'new Speaker':
                    this.view.removeAttendeeOnGrid(info.user);            
                default:
                    this.view.addAttendeeOnGrid(info.user);
            }
        };
    }

    _onRoomUpdate() {
        return this.view.updateAttendeesOnGrid;
    }

    _onUserDisconnected() {
        return this.view.removeAttendeeOnGrid;
    }

    _onUserConnected() {
        return this.view.addAttendeeOnGrid;
    }
}