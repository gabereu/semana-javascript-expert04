export const constants = {
    socketUrl: 'http://localhost:3000',
    socketNamespaces: {
        room: 'room',
        lobby: 'lobby',
    },
    peerConfig: Object.values({
        id: undefined,
        // config: {
        //     port: 9000,
        //     host: 'localhost',
        //     path: '/'
        // }
    }),
    events: {
        USER_CONNECTED: 'userConnection',
        USER_DISCONNECTED: 'userDisconnection',
        JOIN_ROOM: 'joinRoom',
        ROOM_UPDATED: 'roomUpdated',
        UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
        LOBBY_UPDATED: 'lobbyUpdated',
        SPEAK_REQUEST: 'speakRequest',
        SPEAK_ANSWER: 'speakAnswer',
    },
    pages: {
        lobby: '/pages/lobby',
        login: '/pages/login',
    },
};