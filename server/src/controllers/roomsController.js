import Attendee from "../entities/attendee.js";
import Room from "../entities/room.js";
import { constants } from "../util/constants.js";
import ObserverMap from "../util/ObserverMap.js";

export default class RoomsController {
    #users = new Map();
    constructor({ roomsPubSub }) {
        this.roomsPubSub = roomsPubSub;
        this.rooms = new ObserverMap({
            observer: this.#roomObserver(),
            customMapper: this.#mapRoom.bind(this),
        });
    }

    #roomObserver() {
        return {
            notify: this.notifyRoomsSobscribers.bind(this),
        }
    }

    notifyRoomsSobscribers(rooms){
        const event = constants.event.LOBBY_UPDATED;
        this.roomsPubSub.emit(event, [...rooms.values()]);
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

    speakRequest(socket){
        const userId = socket.id;
        const user = this.#users.get(userId);
        const roomId = user?.roomId;
        const owner = this.rooms.get(roomId)?.owner;
        socket.to(owner.id).emit(constants.event.SPEAK_REQUEST, user);
    }

    [constants.event.SPEAK_ANSWER](socket, { answer, user }) {
        const currentUser = this.#users.get(user.id);
        const updatedUser = new Attendee({
            ...currentUser,
            isSpeaker: answer,
        });

        this.#users.set(user.id, updatedUser);

        const room = this.rooms.get(updatedUser.roomId);
        const userOnRoom = [...room.users.values()].find(user => user.id === updatedUser.id);
        room.users.delete(userOnRoom);
        room.users.add(updatedUser);
        this.rooms.set(room.id, room);

        const change = answer ? 'new Speaker' : 'Speak Answer';

        this.#notifyUserProfileUpgrade(socket, updatedUser, change, true);
    }

    disconnect(socket) {
        this.#logoutUser(socket);
        console.log('Disconnected ', socket.id);
    }

    #logoutUser(socket){
        const userId = socket.id;
        const user = this.#users.get(userId);
        if(!user){
            return;
        }
        const roomId = user.roomId;
        this.#users.delete(userId);

        const room = this.rooms.get(roomId);
        if(!room){
            return;
        }

        const toBeDeleted = [...room.users].find(user => user.id === userId);
        room.users.delete(toBeDeleted);

        if(room.users.size === 0){
            this.rooms.delete(roomId);
            return;
        }

        const OwnerDisconected = room.owner.id === userId;
        if(OwnerDisconected){
            room.owner = this.#getNewRoomOwner(room, socket);
        }

        this.rooms.set(roomId, room);

        socket.to(roomId).emit(constants.event.USER_DISCONNECTED, user);
    }

    #getNewRoomOwner(room, socket){
        const users = [...room.users];
        const activeSpeaker = users.find(user => user.isSpeaker);
        const newOwner = activeSpeaker ? activeSpeaker : users[0];
        newOwner.isSpeaker = true;
        const updatedUser = this.#updateGlobalUserData(newOwner);

        this.#notifyUserProfileUpgrade(socket, newOwner, 'new Owner');

        return updatedUser;
    }

    #notifyUserProfileUpgrade(socket, user, change, forSelf = false){
        socket.to(user.roomId).emit(constants.event.UPGRADE_USER_PERMISSION, {user, change});
        if(forSelf){
            socket.emit(constants.event.UPGRADE_USER_PERMISSION, {user, change});
        }
    }

    #replyWithActiveUsers(socket, users){
        socket.emit(constants.event.ROOM_UPDATED, [...users.values()]);
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