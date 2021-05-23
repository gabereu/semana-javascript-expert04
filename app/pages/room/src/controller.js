import { constants } from "../../_shared/constants.js";
import PeerBuilder from "../../_shared/peerBuilder.js";
import Attendee from "./entities/Attendee.js";
import RoomService from "./service.js";
import RoomSocketBuilder from "./util/roomScoket.js";
import RoomView from "./view.js";

export default class RoomCrontroller {
    constructor({ roomInfo, socketBuilder = new RoomSocketBuilder(), view = RoomView, peerBuilder = new PeerBuilder(), roomService = new RoomService() }) {
        this.socketBuilder = socketBuilder;
        this.roomInfo = roomInfo;
        this.view = view;
        this.peerBuilder = peerBuilder;
        this.roomService = roomService;
        this.socket = {};
    }

    async initialize() {
        this._setupViewEvents();
        this.roomService.init();
        this.socket = this._setupSocket();
        this.roomService.setCurrentPeer(await this._setupWebRTC())
    }

    _setupViewEvents(){
        this.view.configureLeaveButton();
        this.view.configureMuteButton(this._onMutePressed());
        this.view.configureClapButton(this._onClapPressed());
        this.view.updateUserImage(this.roomInfo.user);
        this.view.updateRoomTopic(this.roomInfo.room);
    }

    _onMutePressed() {
        return async () => {
            await this.roomService.toggleAudioActivation();
        }
    }

    _onClapPressed() {
        return () => {
            this.socket.emit(constants.events.SPEAK_REQUEST);
        }
    }

    async _setupWebRTC(){
        return this.peerBuilder
            .setOnError(this._onPeerError())
            .setOnConnectionOpenned(this._onPeerConnectionOpenned())
            .setOnCallReceived(this._onCallReceived())
            .setOnCallError(this._onCallError())
            .setOnCallClose(this._onCallClose())
            .setOnStreamReceived(this._onStreamReceived())
            .build();
    }

    _onStreamReceived() {
        return (call, stream) => {
            const callerId = call.peer;
            console.log('_onStreamReceived', call, stream);
            const { isCurrentId } = this.roomService.addReceivedPeer(call);
            this.view.renderAudioElement({
                stream,
                isCurrentId,
            });
        };
    }

    _onCallClose() {
        return call => {
            console.log('_onCallClose', call);
            this.roomService.disconnectPeer({ peerId: call.peer });
        };
    }

    _onCallError() {
        return (call, error) => {
            console.log('_onCallError', call, error);
            this.roomService.disconnectPeer({ peerId: call.peer });
        };
    }

    _onCallReceived() {
        return async call => {
            const stream = await this.roomService.getCurrentStream();
            console.log('answering call', call);
            call.answer(stream);
        };
    }

    _onPeerError() {
        return error => console.error('Erro', error);
    }

    _onPeerConnectionOpenned() {
        return peer => {
            this.roomInfo.user.peerId = peer.id;
            this.roomService.setCurrentPeer(peer);
            this.socket.emit(constants.events.JOIN_ROOM,  this.roomInfo);
        };
    }

    _setupSocket() {
        const socket = this.socketBuilder
            .setOnUserConnected(this._onUserConnected())
            .setOnUserDisconnected(this._onUserDisconnected())
            .setOnRoomUpdated(this._onRoomUpdate())
            .setOnUserProfileUpdated(this._onUserProfileUpdated())
            .setOnSpeakRequested(this._onSpeakRequested())
            .build();

        return socket;
    }

    _onSpeakRequested() {
        return (data) => {
            const attendee = new Attendee(data);
            const result = confirm(`${attendee.username} pode falar?`);
            this.socket.emit(constants.events.SPEAK_ANSWER, { user: attendee, answer: result });
        };
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
            this.roomService.updateCurrentUserWithSameId(info.user);
            this.activateUserFeatures();
        };
    }

    _onRoomUpdate() {
        return users => {
            const attendees = users.map(user => new Attendee(user));
            this.view.updateAttendeesOnGrid(attendees);
            this.roomService.updateCurrentUserProfile(attendees);
            this.activateUserFeatures();
        };
    }

    _onUserDisconnected() {
        return user => {
            this.view.removeAttendeeOnGrid(user);
            this.roomService.disconnectPeer(user);
        }
    }

    _onUserConnected() {
        return user => {
            this.view.addAttendeeOnGrid(user);
            this.roomService.callNewUser(user);
        };
    }

    activateUserFeatures() {
        const currentUser = this.roomService.getCurrentUser();
        this.view.showUserFeatures(currentUser);
    }
}