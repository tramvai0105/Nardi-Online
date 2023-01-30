import React, { useMemo, useState } from "react";
import game from "../store/gameState"
import board from "../models/Board"

const InfoTab = () => {

    const [chipsQty, setChipsQty] = useState([0, 0])

    useMemo(() => {
        setChipsQty(board.getChipsQty())
    }, [board.chips]);

    return(
        <div className="info-tab">
            <div className="turn-info">
                <h1 className="turn-text">Turn:</h1>
                <h1 className="turn-text">{game.turn.toUpperCase()}</h1>
            </div>
            <div className="chips-info">
                <h1 className="chips-info-text">WHITE CHIPS: {chipsQty[0]}</h1>
                <h1 className="chips-info-text">BLACK CHIPS: {chipsQty[1]}</h1>
            </div>
        </div>
    );
}

export default InfoTab;