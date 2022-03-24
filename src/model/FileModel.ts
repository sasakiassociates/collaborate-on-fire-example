import {applySnapshot, ExtendedModel, model, Model, modelAction, ObjectMap, prop} from "mobx-keystone";
import {IFile} from "@strategies/collaborate-on-fire";

@model('cof/AFile')
class AFile extends Model({//NOTE duplicate code with collaborate-on-fire/src/model/ks/AFile.ts
    fileId: prop<string>(''),
    fileName: prop<string>(''),
}) {
    @modelAction
    loadSnapshot(snapshot: any) {
        applySnapshot(this, snapshot);
    }
}

@model('cof/FileModel')
export default class FileModel extends ExtendedModel(AFile, {
    schemaVersion: prop<string>('0.0.1'),
    rectangles: prop<Rectangle[]>(() => []),
    score: prop<number>(0),
}) implements IFile {

    @modelAction
    addRectangle(rect: Rectangle) {
        this.rectangles.push(rect);
    }

    @modelAction
    setScore(score: number) {
        this.score = score;
    }

    @modelAction
    clearRectangles() {
        this.rectangles.length = 0;//TODO is mobx-keystone smart enough?
    }
}

@model('cof/Rectangle')
export class Rectangle extends Model({
    id: prop<string>(''),
    x: prop<number>(0),
    y: prop<number>(0),
    width: prop<number>(0),
    height: prop<number>(0),
    color: prop<string>('#000000'),
}) {
    @modelAction
    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
