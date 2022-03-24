import { observer } from "mobx-react";
import React, { useState } from "react";
import { useStores } from "@strategies/stores";
import RootStore from "../stores/RootStore";

type ToolbarProps = {
    width: number;
    height: number;
};
export const Toolbar = observer(({ width, height }: ToolbarProps) => {
    const root = useStores().root as RootStore;

    const [addInterval, setAddInterval] = useState(0)

    const addRect = () => {
        root.addNewRandomRectangle(width, height);
    };
    const clear = () => {
        if (window.confirm('Are you sure you want to clear the file?')) {
            root.file.clearRectangles();
            root.file.setScore(0);
        }
    };
    const stopAdding = () => {
        clearInterval(addInterval);
        setAddInterval(0);
    };
    const startAdding = () => {
        const i: any = setInterval(() => {
            if (Math.random() < 0.2) {
                root.addNewRandomRectangle(width, height);
            }
            if (root.likeColorsExist && root.likeColorsAllTouching) {
                root.file.setScore(root.file.score + 1);
            }
        }, 500);
        setAddInterval(i);
    };
    return <div>
        <button onClick={addRect}>ADD RECT</button>
        {addInterval === 0 && <button onClick={startAdding}>START ADDING</button>}
        {addInterval > 0 && <button onClick={stopAdding}>STOP ADDING</button>}

        <button onClick={clear}>CLEAR</button>
    </div>
});
