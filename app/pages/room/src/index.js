import { constants } from "../../_shared/constants.js";
import RoomCrontroller from "./controller.js";
import RoomSocketBuilder from "./util/roomScoket.js";
import RoomView from "./view.js";

const urlParams = new URLSearchParams(window.location.search);
const keys = ['id', 'topic'];

const urlData = keys.map(key => [key, urlParams.get(key)]);

const room = Object.fromEntries(urlData);

const user = {
    img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/pilot_traveller_person_avatar-256.png',
    username: prompt('Username'),
    // username: 'Gabriel',
};

const roomInfo = { user, room };

const socketBuilder = new RoomSocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room,
});

const roomController = new RoomCrontroller({
    socketBuilder,
    roomInfo,
    view: RoomView,
});

roomController.initialize();

// 
