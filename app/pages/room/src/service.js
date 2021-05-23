import Media from "../../_shared/media.js";
import UserStream from "./entities/UserStream.js";

export default class RoomService {
    constructor({ media = Media }) {
        this.media = media;
        this.currentPeer = {};
        this.currentUser = {};
        this.currentStream = {};
        this.isAudioActive = true;
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
            if(!this.currentUser.isSpeaker && user.isSpeaker){
                this.reconnectAsSpeaker();
            }
            this.currentUser = user;
        }
    }

    getCurrentUser(){
        return this.currentUser;
    }

    async toggleAudioActivation(){
        this.isAudioActive = !this.isAudioActive;
        await this.switchAudioStreamSource({ realAudio: this.isAudioActive });
    }

    async updateCurrentUserProfile(users) {
        this.currentUser = users.find(user => user.peerId === this.currentPeer.id);
    }

    _reconnectPeers(stream){
        for(const peer of this.peers.values()){
            const peerId = peer.call.peer;
            peer.call.close();

            console.log('calling peerid', peerId);
            this.currentPeer.call(peerId, stream);
        }
    }

    async reconnectAsSpeaker(){
        return this.switchAudioStreamSource({ realAudio: true });
    }

    async switchAudioStreamSource({ realAudio }){
        const userAudio = realAudio 
        ? await this.media.getUserAudio()
        : this.media.createFakeMediaStream();

        this.currentStream = new UserStream({
            isFake: realAudio,
            stream: userAudio,
        });

        this.currentUser.isSpeaker = realAudio;
        this._reconnectPeers(this.currentStream.stream);
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