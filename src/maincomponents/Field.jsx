import { Stage, Layer, Image as KonvaImage} from 'react-konva'
import fieldimg from "../images/nardi.png"
import playerimg from "../images/playerimg.png"
import ChipComp from './ChipComp'
import game from "../store/gameState"
import board from '../models/Board'
import {observer} from "mobx-react-lite"
import { useEffect, useMemo, useState} from 'react'
import LineComp from './LineComp'
import PlayerTab from './PlayerTab'
import Bones from './Bones'
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ref } from 'vue'
import { useRef } from 'react'
import {useParams} from "react-router-dom"

const Field = observer(() => {
  const img = new Image()
  img.src = fieldimg
  const params = useParams()

  const [modal, setModal] = useState(true);
  const username = useRef("")

  function restart(){
    board.init()
    board.linesHeightSort()
  }

  const handleConnection = () =>{
    setModal(false)
    const socket = new WebSocket("ws://localhost:5000")
    board.setSocket(socket)
    board.setSessionId(params.id)
    board.setUsername(username.current.value)
    socket.onopen = () => {
      socket.send(JSON.stringify({
        id:params.id,
        username: username.current.value,
        method: "connection"
      }))
    }
    socket.onmessage = (event) => {
      let msg = JSON.parse(event.data);
      switch(msg.method){
        case "connection":
          board.connected = true;
          if(msg.pwhite){
            game.setWhiteName(msg.pwhite);
          }
          if(msg.pblack){
            game.setBlackName(msg.pblack);
          }
          break
        case "sit":
          handleSit(msg);
          break
        case "start":
          game.setTurn(msg.turn);
          board.setBones(msg.bones);
          board.setCanpickhead()
          break
        case "move":
          handleMove(msg);
          break
        case "changeturn":
          handleChangeTurn(msg);
          break
        case "win":
          handleWin(msg);
          break
      }
    }
  }

  const handleWin = (msg) =>{
    console.log(`Player ${msg.username} winned!!!`);
  }

  const handleChangeTurn = (msg) =>{
    board.setBones(msg.bones)
    game.setTurn(msg.turn)
  }

  const handleMove = (msg) => {
    board.changeChipLine(msg)
  }

  const handleSit = (msg) => {
    if(msg.color=="white"){
      game.white_name = msg.username;
    }
    if(msg.color=="black"){
      game.black_name = msg.username;
    }
    if(board.username == msg.username && board.chips.length == 0){
      game.pc = msg.color;
      restart()
    }
  }

  useMemo(()=>{
    board.linesHeightSort()
  })

  // useEffect(() => {
  //   restart()
  // }, []);

  return (
      <div className='game'>
        <Modal show={modal} onHide={()=>{setModal(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Введите имя:</p>
          <input type='text' ref={username}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>{handleConnection()}}>
            Save Changes
          </Button>
        </Modal.Footer>
        </Modal>
        <div className='gui'>
          <PlayerTab num={1} img={playerimg} playername={game.white_name}/>
          <Bones firstnum={1} secondnum={5}/>
          <PlayerTab num={2} img={playerimg} playername={game.black_name}/>
        </div>
        <Stage width={1000} height={600}>
          <Layer>
            <KonvaImage image={img} />  
          </Layer>
          <Layer>
            {board.chips.map((chip, index)=>
                <ChipComp
                key={index}
                x={chip.x}
                y={chip.y}
                fill={chip.fill}
                stroke={chip.stroke}
                />
            )}
          </Layer>
          <Layer>
            {board.lines.map((line, index)=>
                <LineComp
                key={index}
                num={line.num}
                x={line.x}
                y={line.y}
                width={line.width}
                height={line.height}
                fill={line.fill}
                stroke={line.stroke}
                />
            )}
          </Layer>
        </Stage>
        <div className='dev-instr'>
          <button onClick={()=>{board.bones = game.bones}}>Bones update</button>
          <button onClick={()=>{board.canpickhead = true}}>Pick head</button>
          <button onClick={()=>{board.changeTurn()}}>Change turn</button>
          <h6>{board.bones}</h6>
        </div>
      </div>
  );
})

export default Field;