import { constants } from "../../_shared/constants.js";
import LobbyController from "./controller.js";
import LobbySocketBuilder from "./util/lobbySocketBuilder.js";

const user = {
    img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/pilot_traveller_person_avatar-256.png',
    // username: prompt('Username'),
    username: 'Gabriel',
};

const socketBuilder = new LobbySocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.lobby,
});

const lobbyController = new LobbyController({
    socketBuilder,
    user,
});

lobbyController.initialize()
    .catch(error => {
        alert(error.message);
    });
