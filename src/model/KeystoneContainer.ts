import {IStateContainer} from "@strategies/collaborate-on-fire";
import {getSnapshot, onSnapshot, onPatches, applyPatches} from "mobx-keystone";

export default class KeystoneContainer implements IStateContainer {
    getSnapshot<T>(nodeOrPrimitive: T): any {
        return getSnapshot(nodeOrPrimitive);
    }

    onSnapshot<T extends object>(node: T, listener: (newSnapshot: any, previousSnapshot: any) => void): any {
        return onSnapshot(node, listener);
    }

    onPatches(subtreeRoot: object, listener: (patches: any[], inversePatches: any[]) => void): any {
        return onPatches(subtreeRoot, listener);
    }

    applyPatches(subtreeRoot: object, patches:any[]) {
        return applyPatches(subtreeRoot, patches);
    }
}
