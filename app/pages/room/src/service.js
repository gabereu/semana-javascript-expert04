import Media from "../../_shared/media.js";
import UserStream from "./entities/UserStream.js";

export default class RoomService {
    constructor({ media = Media }) {
        this.media = media;
        this.currentPeer = {};
        this.currentUser = {};
        this.currentStream = {};

        this.peers = new Map();
    }

    async init() {
        this.currentStream = new UserStream({
            stream: await this.media.getUserAudio(),
            isFake: false,
        });
    }

    setCurrentPeer(peer) {
        this.currentPeer = peer;
    }

    updateCurrentUserWithSameId(user) {
        if(user.id === this.currentUser.id){
            this.currentUser = user;
        }
    }

    getCurrentUser(){
        return this.currentUser;
    }

    updateCurrentUserProfile(users) {
        this.currentUser = users.find(user => user.peerId === this.currentPeer.id);
    }

    async getCurrentStream() {
        const { isSpeaker } = this.currentUser;

        if(isSpeaker){
            return this.currentStream.stream;
        }

        return this.media.createFakeMediaStream();
    }

    addReceivedPeer(call){
        const callerId = call.peer;
        this.peers.set(callerId, { call });

        const isCurrentId = callerId === this.currentPeer.id;

        return {
            isCurrentId,
        }
    }

    async callNewUser(user){
        const { isSpeaker } = this.currentUser;
        if(!isSpeaker) return;

        const stream = await this.getCurrentStream();
        this.currentPeer.call(user.peerId, stream);
    }

    disconnectPeer({ peerId }){
        const peer = this.peers.get(peerId);
        if(!peer) return;

        peer.call.close();

        this.peers.delete(peerId);

    }
}