import Event from 'events';
import LobbyController from './controllers/lobbyController.js';
import RoomsController from "./controllers/roomsController.js";
import { constants } from './util/constants.js';
import SocketServer from "./util/SocketServer.js";

const port = process.env.PORT || 3000;
const socketServer = new SocketServer({ port });

const server = await socketServer.start();

const roomsPubSub = new Event();

const roomsController = new RoomsController({ roomsPubSub });
const lobbyController = new LobbyController({
    activeRooms: roomsController.rooms,
    roomsListener: roomsPubSub,
});

const namespaces = {
    room: { controller: roomsController, eventEmitter: new Event() },
    lobby: { controller: lobbyController, eventEmitter: roomsPubSub },
};

// nameSpaces.room.eventEmitter.on(
//     'userConnected',
//     nameSpaces.room.controller.onNewConnection.bind(nameSpaces.room.controller),
// );

const routeConfig = Object.entries(namespaces)
    .map(([namespace, { controller, eventEmitter }]) => {
        const controllerEvents = controller.getEvents();
        eventEmitter.on(
            constants.event.USER_CONNECTED,
            controller.onNewConnection.bind(controller),
        );

        return {
            [namespace]: {
                events: controllerEvents,
                eventEmitter,
            }
        }
    })
;

socketServer.attachEvents({ routeConfig });


console.log('Socket server running on', server.address().port);