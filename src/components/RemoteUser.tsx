import { observer } from "mobx-react";
import { UserItem } from "../model/UserStore";

type RemoteUserProps = {
    user: UserItem;
    stroke: string;
};
export const RemoteUser = observer((props: RemoteUserProps) => {
    const {
        user,
        stroke
    } = props;
    return <g transform={`translate(${user.cursorX} ${user.cursorY})`}>
        <path d="M 0 0 L 5 4.5 L 11.5 5.5 L 0 17 Z" transform="translate(0 2) rotate(120 5.75 8.5)" fill={user.color}
              stroke={stroke}/>
        <rect rx={8} x={14} y={16} width={100} height={24} fill={user.color} stroke={stroke} fillOpacity={0.8}/>
        <text fill={stroke} x={22} y={32} fontSize={12}>{user.name}</text>
    </g>
});
