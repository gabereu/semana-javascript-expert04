export const constants = {
    socketUrl: 'http://localhost:3000',
    socketNamespaces: {
        room: 'room',
        lobby: 'lobby',
    },
    events: {
        USER_CONNECTED: 'userConnection',
        USER_DISCONNECTED: 'userDisconnection',
        JOIN_ROOM: 'joinRoom',
        ROOM_UPDATED: 'roomUpdated',
        UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
        LOBBY_UPDATED: 'lobbyUpdated',
    },
};