import firebase from "firebase";
import firebaseConfig from "../config";
import {IStateContainer, MultiUserPersistence} from "@strategies/collaborate-on-fire";
import {UserItem} from "../model/UserStore";
import RootStore from "./RootStore";
import KeystoneContainer from "../model/KeystoneContainer";

// import {PatchModuleTest} from "@strategies/collaborate-on-fire";

export class AppStateManager {
    userSession: any;

    constructor(rootStore: RootStore) {
        const {userStore} = rootStore;
        console.log('initializeApp?', firebase.apps.length);
        let app:firebase.app.App;
        if (firebase.apps.length > 0) {
            app = firebase.apps[0];
        } else {
            app = firebase.initializeApp(firebaseConfig);
        }
        const stateContainer: IStateContainer = new KeystoneContainer();

        firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
            if (!user) return;
            userStore.setLocalUser(new UserItem({uid: user.uid, name:user.displayName}));
            new MultiUserPersistence(app, rootStore, stateContainer, {sessionUserId: user.uid, sendPatchIntervalTime: 250});
            // new SingleUserPersistence(app ,rootStore, stateContainer);
        });
    }
}
