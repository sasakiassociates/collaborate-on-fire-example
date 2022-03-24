import { applySnapshot, getSnapshot, model, Model, modelAction, objectMap, prop } from "mobx-keystone";
import { action, computed, makeObservable, observable } from "mobx";
import { IUserStore } from "@strategies/collaborate-on-fire";
import { Rectangle } from "./FileModel";

const timestamp = ()=> {
    return Math.floor(Date.now() / 1000);
}
@model('cof/UserItem')
export class UserItem extends Model({
    uid: prop<string>(''),
    color: prop<string>(''),
    name: prop<string>(''),
    cursorX: prop<number>(0),
    cursorY: prop<number>(0),
    lastUpdate: prop<number>(0),
}) {

    @modelAction
    setColor(color: string) {
        this.color = color;
        this.lastUpdate = timestamp();
    }

    @modelAction
    setCursorPosition(x: number, y: number) {
        this.cursorX = x;
        this.cursorY = y;
        this.lastUpdate = timestamp();
    }
}

//Note: the user store includes all users - both remote and local. Computed properties provide easy access to the local
//user or a list of remote users
@model('cof/UserStore')
class UserStore extends Model({
    userCollection: prop<UserItem[]>(() => []),
}) implements IUserStore {
    @observable
    localUserId: string = '';

    @observable
    timeStamp: number = 0;

    constructor(props: any) {
        super(props);
        makeObservable(this);

        //every second, update the timestamp to trigger updates like users becoming 'stale'
        setInterval(() => {
            this.setTimeStamp(timestamp());
        }, 1000);
    }

    @action
    setTimeStamp(t:number) {
        this.timeStamp = t;
    }

    @computed
    get allUsers() {
        // const ans: UserItem[] = [];
        // this.userCollection.forEach((value, key) => {
        //     ans.push(value);
        // });
        return this.userCollection;
    }

    @computed
    get staleTimeStamp() {
        let seconds = 60;
        return this.timeStamp - seconds;
    }


    @computed
    get remoteUsers() {
        return this.allUsers.filter(u => u.uid !== this.localUserId && u.lastUpdate > this.staleTimeStamp);
    }

    @computed
    get localUser() {
        return this.userCollection.find(v => v.uid === this.localUserId);
    }

    @modelAction
    setLocalUser(userItem: UserItem) {
        console.log('SET LOCAL USER', userItem);
        this.localUserId = userItem.uid;
        this.userCollection.push(userItem);
    }

    @modelAction
    applyUserSnapshot(userKey: string, snapshot: any) {
        console.log('applyUserSnapshot', userKey, snapshot);

        const existingItem = this.userCollection.find(v => v.uid === userKey);
        if (!existingItem) {
            this.userCollection.push(new UserItem(snapshot));
        } else {
            applySnapshot(existingItem, snapshot);
        }
    }
}


export default UserStore;
