import {Rect} from 'react-konva'
import board from '../models/Board';
import game from "../store/gameState";
import {observer} from "mobx-react-lite"
import { useEffect, useMemo} from 'react'
import { useState } from 'react';

const LineComp = observer(({num,x,y,width,height, fill, stroke}) => {

  const [chosen, setChosen] = useState(false)
  const [Stroke, setStroke] = useState(stroke)

  useMemo(() => {
    if(chosen){
      setStroke("red")
    }else{
      setStroke("black")
    }
  }, [chosen]);

  useMemo(()=>{
    if(board.chosenline != num){
      setChosen(false)
    }
  }, [board.lineischosen])

  const choose = () => {
    if(game.pc == game.turn){
      if(board.lineischosen){
        if(chosen == false){
          board.moveChip(num)
        }
        board.anChooseLines()
      }else{
        if(num != 25){
          board.chooseLine(num)
          setChosen(true)
        }
      }
    }
    }

  return (
    <Rect
    onClick={()=>choose(num)}
    x={x}
    y={y}
    width={width}
    height={height}
    fill={fill}
    stroke={Stroke}
    />
  );
})

export default LineComp;