import { constants } from "../../_shared/constants.js";
import UserDb from "../../_shared/userDB.js";

function redirectToLobby() {
    window.location = constants.pages.lobby;
}

function toLogin(provider, firebase) {
    return async () => {
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            const { user } = result;
            const userData = {
                img: user.photoURL,
                username: user.displayName,
            };
            UserDb.insert(userData);
            redirectToLobby();

        } catch (error) {
            alert(JSON.stringify(error));
            console.log(error);
        }
    }
}

if(UserDb.hasUser()){
    redirectToLobby();
}

const { firebaseConfig } = constants; 

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const provider = new firebase.auth.GithubAuthProvider();
provider.addScope('read:user');

const btnLogin = document.getElementById('btnLogin');
btnLogin.addEventListener('click', toLogin(provider, firebase));


