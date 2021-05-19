import LobbySocketBuilder from "./util/lobbySocketBuilder.js";
import LobbyView from "./view.js";

export default class LobbyController {
    constructor({ socketBuilder = new LobbySocketBuilder(), user, view = LobbyView }) {
        this.socketBuilder = socketBuilder; 
        this.user = user;
        this.view = view;
        this.socket = {};
    }

    async initialize() {
        this._setupViewEvents();
        this.socket = this._setupSocket();
    }

    _setupViewEvents(){
        this.view.updateUserImage(this.user);
        this.view.configureCreateRoomButton();
    }

    _setupSocket(){
        const socket = this.socketBuilder
            .setOnLobbyUpdated(this._onLobbyUpdated())
            .build();
            
        return socket;
    }

    _onLobbyUpdated() {
        return this.view.updateRoomList;
    }
}