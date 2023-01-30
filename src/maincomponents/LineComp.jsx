import {Circle, Rect} from 'react-konva'
import board from '../models/Board';
import game from "../store/gameState";
import {observer} from "mobx-react-lite"
import React, { useEffect, useMemo, useRef} from 'react'
import { useState } from 'react';

const LineComp = observer(({num,x,y,width,height, fill, stroke}) => {

  const [chosen, setChosen] = useState(false)
  const [Stroke, setStroke] = useState("")
  const [Fill, setFill] = useState("")
  const [yC, setYC] = useState(0)

  const pointer = useRef('')

  // const poinerAnimation = () => {
  //   pointer.current.to({
  //     scaleRadius:2,
  //     duration:2,
  //     onFinish: ()=>{
  //       pointer.current.to({})
  //     }
  //   })
  // }

  useMemo(() => {
    if(chosen){
      console.log(pointer);
      // poinerAnimation()
      setStroke("#FFF36D")
      setFill("")
    }else{
      setStroke("")
      setFill("")
    }
  }, [chosen]);

  useMemo(()=>{
    if(board.chosenline == num){
      setChosen(true)
    } else {setChosen(false)}
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
          setYC(board.chooseLine(num))
        }
      }
    }
    }

  return (
    <React.Fragment>
      <Circle
        x={x+35} y={yC} 
        radius={30} 
        fill={Fill} 
        stroke={Stroke}
        strokeWidth={4}
        ref={pointer}
      />
      <Rect
      onClick={()=>choose(num)}
      x={x}
      y={y}
      width={width}
      height={height}
      // fill={fill}
      // stroke={Stroke}
      />
    </React.Fragment>
  );
})

export default LineComp;