import { observer } from "mobx-react";
import React, { useState } from "react";
import { ColorResult, SketchPicker } from 'react-color';
import { useStores } from "@strategies/stores";
import RootStore from "../stores/RootStore";

type UserInfoProps = {};
export const UserInfo = observer(({}: UserInfoProps) => {
    const root = useStores().root as RootStore;
    const { userStore } = root;

    if (!userStore.localUser) {
        return null;
    }

    const handleChange = (color: ColorResult) => {
        if (userStore.localUser) {
            userStore.localUser.setColor(color.hex);
        }
    };
    return <div className={'UserInfo'}>
        <div className={'color-picker'}>
            <SketchPicker color={userStore.localUser.color} onChange={handleChange}/>
        </div>
    </div>
});
