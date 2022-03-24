import React, { useState } from 'react';
import { Stage } from "./components/Stage";
import { useStores } from "@strategies/stores";
import RootStore from "./stores/RootStore";
import './App.css';
import { observer } from "mobx-react";
import { Toolbar } from "./components/Toolbar";
import { UserInfo } from "./components/UserInfo";

type AppProps = {};
const App = observer((props: AppProps) => {
    const root = useStores().root as RootStore;

    const width = 1000;
    const height = 700;

    return (
        <div className="App">
            <div>LOGGED IN {root.loggedIn ? 'TRUE' : 'FALSE'}</div>
            <div>localUserId {root.userStore.localUserId}</div>
            {!root.loggedIn && <>
                <button onClick={() => {
                    root.login();
                }
                }>LOGIN
                </button>
            </>}
            {root.loggedIn && <>
                <h3>Score: {root.file.score}</h3>
                <p>{root.likeColorsExist ? 'active' : ''} {root.likeColorsAllTouching ? '👍' : '👎'}</p>
                <Stage width={width} height={height}/>
                <Toolbar width={width} height={height}/>
                <UserInfo/>
            </>}
        </div>
    );
});
export default App;
