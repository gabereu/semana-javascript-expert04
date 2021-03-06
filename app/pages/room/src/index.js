import { constants } from "../../_shared/constants.js";
import Media from "../../_shared/media.js";
import PeerBuilder from "../../_shared/peerBuilder.js";
import UserDb from "../../_shared/userDB.js";
import RoomCrontroller from "./controller.js";
import RoomService from "./service.js";
import RoomSocketBuilder from "./util/roomScoket.js";
import RoomView from "./view.js";

const urlParams = new URLSearchParams(window.location.search);
const keys = ['id', 'topic'];

const urlData = keys.map(key => [key, urlParams.get(key)]);

const room = Object.fromEntries(urlData);

// const user = {
//     img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/pilot_traveller_person_avatar-256.png',
//     username: prompt('Username'),
//     // username: 'Gabriel',
// };

if(!UserDb.hasUser()){
    RoomView.redirectToLogin();
}
const user = UserDb.get();

const roomInfo = { user, room };

const peerBuilder = new PeerBuilder({
    peerConfig: constants.peerConfig,
});

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room,
});

const roomService = new RoomService({
    media: Media,
});

const roomController = new RoomCrontroller({
    socketBuilder,
    roomInfo,
    view: RoomView,
    peerBuilder,
    roomService,
});

roomController.initialize();
