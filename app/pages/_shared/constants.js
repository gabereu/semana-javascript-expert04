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
    firebaseConfig: {
        apiKey: "AIzaSyDjrgxDI90PUn968L37JBh58H2y9BZXqyg",
        authDomain: "semana-js-expert-04-218f5.firebaseapp.com",
        projectId: "semana-js-expert-04-218f5",
        storageBucket: "semana-js-expert-04-218f5.appspot.com",
        messagingSenderId: "443648529218",
        appId: "1:443648529218:web:39774ce9b13f1a05052edb",
        measurementId: "G-H0ZTBDMNQ1",
    },
    storageKey: 'jsExpert:storage:user'
};