import {applySnapshot, getSnapshot, model, Model, modelAction, objectMap, prop} from "mobx-keystone";
import {action, computed, makeObservable, observable} from "mobx";
import {IUserStore} from "@strategies/collaborate-on-fire";
import {Rectangle} from "./FileModel";

@model('cof/UserItem')
export class UserItem extends Model({
    uid: prop<string>(''),
    color: prop<string>(''),
    name: prop<string>(''),
    cursorX: prop<number>(0),
    cursorY: prop<number>(0),
}) {
    @modelAction
    setCursorPosition(x:number, y:number) {
        this.cursorX = x;
        this.cursorY = y;
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

    constructor(props:any) {
        super(props);
        makeObservable(this);
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
    get remoteUsers() {
        return this.allUsers.filter(u => u.uid !== this.localUserId);
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
        const existingItem = this.userCollection.find(v => v.uid === userKey);
        if (!existingItem) {
            this.userCollection.push(new UserItem(snapshot));
        } else {
            applySnapshot(existingItem, snapshot);
        }
    }
}


export default UserStore;
