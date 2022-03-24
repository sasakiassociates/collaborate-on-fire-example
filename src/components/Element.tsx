import {observer} from "mobx-react";
import {Rectangle} from "../model/FileModel";
import {useRef, useState} from "react";
import {useStores} from "@strategies/stores";
import RootStore from "../stores/RootStore";
import {UndoManager} from "mobx-keystone";

type UndoGroup = {//simplified keystone undo/redo group
    continue<T>(fn: () => T): T;
    end(): void;
}

type ElementProps = {
    rectangle: Rectangle;
};
export const Element = observer(({rectangle}: ElementProps) => {
    const {x, y, width, height, color} = rectangle;
    const undoRef = useRef<UndoGroup | null>(null);
    const root = useStores().root as RootStore;
    const undoManager = root.undoManager as UndoManager;

    const offset = useRef({x:0,y:0});

    const mouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (undoRef.current) {
            undoRef.current.continue(()=> {
                rectangle.setPosition(e.clientX - offset.current.x, e.clientY - offset.current.y);
            })
        } else {
            rectangle.setPosition(e.clientX - offset.current.x, e.clientY - offset.current.y);
        }
    };
    const mouseUp = () => {
        undoRef.current?.end();
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
    };

    const onMouseDown = (e: any) => {
        undoRef.current = undoManager.createGroup("Drag element")
        offset.current = {
            x:e.clientX - x,
            y:e.clientY - y,
        }
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
    };

    return <rect onMouseDown={onMouseDown} rx={10} x={x} y={y} width={width} height={height} fill={color}
                 stroke={'white'} strokeWidth={2} fillOpacity={0.9}/>
});
