import { constants } from "../util/constants.js";

export default class LobbyController {
    constructor({ activeRooms, roomsListener }) {
        this.activeRooms = activeRooms;
        this.roomsListener = roomsListener;
    }

    onNewConnection(socket){
        const { id } = socket;
        console.log('[Lobby] Conectado com id:', id);
        this.#updateActiveRooms(socket, [...this.activeRooms.values()]);
    }

    #updateActiveRooms(socket, activeRooms){
        socket.emit(constants.event.LOBBY_UPDATED, activeRooms);
    }

    getEvents() {
        const functions = Reflect.ownKeys(LobbyController.prototype)
            .filter(functionName => functionName !== 'constructor')
            .map(functionName => [functionName, this[functionName].bind(this)]);

        return new Map(functions);
    }
}