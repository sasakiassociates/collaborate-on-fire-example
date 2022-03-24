import firebase from "firebase";
import {registerRootStore, undoMiddleware} from "mobx-keystone";
import UserStore from "../model/UserStore";
import FileModel, {Rectangle} from "../model/FileModel";
import {Store, useStores} from '@strategies/stores';
import {action, computed, makeObservable} from "mobx";
import {AppStateManager} from "./AppStateManager";
import {IRootStore, IUndoManager} from "@strategies/collaborate-on-fire";

const palette = ["#7499d9",
    "#8abf36",
    "#7449cb",
    "#64bf68",
    "#ce52c0",
    "#4c7935",
    "#68529c",
    "#d0ac49",
    "#c4608c",
    "#52b8a4",
    "#df4440",
    "#836e30",
    "#913a36",
    "#d37b48"];

const fakeSomeUsers = (root: RootStore) => {

    let counter = 0;
    setInterval(() => {
            root.userStore.applyUserSnapshot('fake_remote_1', {
                uid: 'fake_remote_1',
                name: 'Fake Remote 1',
                color: '#ff0000',
                cursorX: 100 + 2 * counter,
                cursorY: 100 + counter,
            });
            root.userStore.applyUserSnapshot('fake_remote_2', {
                uid: 'fake_remote_2',
                name: 'Fake Remote 2',
                color: '#ff00ff',
                cursorX: 800 - counter,
                cursorY: counter * 1.5,
            });
            counter++;
        }, 100
    )

};


const uuid = () => {
    return `${Math.round(Math.random() * 100000000000)}`;//good enough for an example project
}


export default class RootStore extends Store implements IRootStore {
    file: FileModel;
    undoManager: IUndoManager;
    userStore: UserStore;

    constructor(fileId: string) {
        super();

        makeObservable(this);

        this.file = new FileModel({fileId: fileId});
        this.userStore = new UserStore({});

        registerRootStore(this.file);
        registerRootStore(this.userStore);

        this.undoManager = undoMiddleware(this.file);

        // fakeSomeUsers(this);
    }

    onRegister() {
        new AppStateManager(this);
    }

    @action
    addNewRandomRectangle(width: number, height: number) {
        const rectWidth = 75 + Math.random() * 50;
        const rectHeight = 75 + Math.random() * 50;
        const color = palette[Math.floor(Math.random() * palette.length)]
        const rect = new Rectangle({
            id: uuid(),
            x: Math.random() * (width - rectWidth),
            y: Math.random() * (height - rectHeight),
            width: rectWidth,
            height: rectHeight,
            color
        });
        this.file.addRectangle(rect);
    }

    @computed
    get likeColorsExist() {
        const findAlike = (a: Rectangle, b: Rectangle) => {
            return (a.color === b.color);
        }
        for (let i = 0; i < this.file.rectangles.length; i++) {
            for (let j = i + 1; j < this.file.rectangles.length; j++) {
                if (findAlike(this.file.rectangles[i], this.file.rectangles[j])) return true;
            }
        }
        return false;
    }

    @computed
    get likeColorsAllTouching() {
        const findOverlapOrUnalike = (a: Rectangle, b: Rectangle) => {
            if (a.color !== b.color) return true;
            const aLeftOfB = a.x + a.width < b.x;
            const aRightOfB = a.x > b.x + b.width;
            const aAboveB = a.y > b.y + b.height;
            const aBelowB = a.y + a.height < a.y;

            return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
        }
        for (let i = 0; i < this.file.rectangles.length; i++) {
            for (let j = i + 1; j < this.file.rectangles.length; j++) {
                if (!findOverlapOrUnalike(this.file.rectangles[i], this.file.rectangles[j])) return false;
            }
        }
        return true;
    }

    @computed
    get loggedIn() {
        return !!this.userStore.localUserId;
    }

    @action
    login() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    }
}
