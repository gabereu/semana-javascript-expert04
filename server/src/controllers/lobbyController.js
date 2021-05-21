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

        this.#activateEventProxy(socket);
    }

    #updateActiveRooms(socket, activeRooms){
        socket.emit(constants.event.LOBBY_UPDATED, activeRooms);
    }

    #activateEventProxy(socket) {
        this.roomsListener.on(constants.event.LOBBY_UPDATED, rooms => {
            this.#updateActiveRooms(socket, rooms);
        });
    }

    getEvents() {
        const functions = Reflect.ownKeys(LobbyController.prototype)
            .filter(functionName => functionName !== 'constructor')
            .map(functionName => [functionName, this[functionName].bind(this)]);

        return new Map(functions);
    }
}