import {makeAutoObservable} from "mobx"

class Game{
    white_name = ""
    black_name = ""
    turn = ""
    pc = ""
    constructor(){
        makeAutoObservable(this)
    }
    setWhiteName(name){
        this.white_name = name
    }
    setBlackName(name){
        this.black_name = name
    }
    setTurn(turn){
        this.turn = turn
    }
}

export default new Game()
