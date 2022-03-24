import { observer } from "mobx-react";
import { useStores } from '@strategies/stores';
import { Element } from "./Element";
import RootStore from "../stores/RootStore";
import { RemoteUser } from "./RemoteUser";
import { useEffect, useRef } from "react";

type StageProps = {
    width: number;
    height: number;
};
export const Stage = observer(({ width, height }: StageProps) => {
    const root = useStores().root as RootStore;
    const stageSvgRef = useRef<SVGSVGElement | null>(null);
    //
    const mouseMove = (e:React.MouseEvent<SVGSVGElement>) => {
        console.log('MOUSE MOVE', e);
        const rect = stageSvgRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            //NOTE: each user is responsible for maintaining their localUser's state
            //this will automatically be broadcast to other users
            root.userStore.localUser?.setCursorPosition(x, y);
        }
    };
    return <svg onMouseMove={mouseMove} ref={stageSvgRef} className={'Stage'} width={width} height={height}>
        {root.file.rectangles.map((r) =>
            <Element key={r.id} rectangle={r}/>
        )}
        {root.userStore.remoteUsers.map((u) => <RemoteUser key={u.uid} user={u} stroke={'#ffffff'}/>)}
    </svg>
});
