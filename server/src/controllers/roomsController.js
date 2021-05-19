import Attendee from "../entities/attendee.js";
import Room from "../entities/room.js";
import { constants } from "../util/constants.js";

export default class RoomsController {
    #users = new Map();
    constructor() {
        this.rooms = new Map();
    }

    onNewConnection(socket) {
        const { id } = socket;
        console.log('Connection stabilished with', id);
    }

    joinRoom(socket, {user, room}) {
        user.id = socket.id;
        const roomId = room.id;

        const userData = this.#updateGlobalUserData({...user, roomId})

        const updatedRoom = this.#joinUserRoom(socket, userData, room);

        this.#notifyUsersOnRoom(socket, roomId, constants.event.USER_CONNECTED, userData);
        this.#replyWithActiveUsers(socket, updatedRoom.users);
    }

    #replyWithActiveUsers(socket, users){
        socket.emit(constants.event.LOBBY_UPDATED, [...users.values()]);
    }

    #notifyUsersOnRoom(socket, roomId, event, data) {
        socket.in(roomId).emit(event, data);
    }

    #joinUserRoom(socket, user, room){
        const roomId = room.id;
        const existingRoom = this.rooms.has(roomId);
        const currentRoom = existingRoom ? this.rooms.get(roomId) : {};
        
        const updatedUser = this.#updateGlobalUserData(new Attendee({
            ...user,
            roomId,
            isSpeaker: !existingRoom,
        }));

        socket.join(roomId);
        
        const [owner, users] = existingRoom ? 
            [currentRoom.owner, currentRoom.users] : [updatedUser, new Set()];

        const updatedRoom = this.#mapRoom({
            ...currentRoom,
            ...room,
            owner,
            users: new Set([...users, updatedUser]),
        });

        this.rooms.set(roomId, updatedRoom);

        return this.rooms.get(roomId);
    }

    #mapRoom(room){
        const users = [...room.users.values()];
        const speakersCount = users.filter(user => user.isSpeaker).length;
        const featuredAttendees = users.slice(0, 3);

        const mappedRoom = new Room({
            ...room,
            speakersCount,
            featuredAttendees,
            attendeesCount: room.users.size,
        });

        return mappedRoom;
    }

    #updateGlobalUserData(userData) {
        const user = this.#users.get(userData.id) ?? {};
        const updatedUser = new Attendee({
            ...user,
            ...userData,
        });
        this.#users.set(updatedUser.id, updatedUser);

        return updatedUser;
    }

    getEvents() {
        const functions = Reflect.ownKeys(RoomsController.prototype)
            .filter(functionName => functionName !== 'constructor')
            .map(functionName => [functionName, this[functionName].bind(this)]);

        return new Map(functions);
    }
}