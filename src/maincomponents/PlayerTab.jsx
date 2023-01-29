import React, { useState } from "react";
import board from "../models/Board";

const PlayerTab = ({num ,img, playername}) => {

    return (
        <div className="player-tab">
            {(num==1)
                ?
                <React.Fragment>
                <img className="player-img" src={img} onClick={()=>board.takeSeat("white")}/>
                <h1 className="player-name name-white">{(playername)?playername:"Player 1"}</h1>
                </React.Fragment>
                :
                <React.Fragment>
                <h1 className="player-name name-black">{(playername)?playername:"Player 1"}</h1>
                <img className="player-img" src={img} onClick={()=>board.takeSeat("black")}/>
                </React.Fragment>
            }
        </div>
    )
}

export default PlayerTab;