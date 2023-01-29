import { Chip } from "./Chip"
import { Line } from "./Line"
import game from "../store/gameState"
import {makeAutoObservable} from "mobx"

class Board{
    linescoords = {
        1:[925, 60],
        2:[855, 60],
        3:[785, 60],
        4:[715, 60],
        5:[645, 60],
        6:[575, 60],
        7:[425, 60],
        8:[355, 60],
        9:[285, 60],
        10:[215, 60],
        11:[145, 60],
        12:[75, 60],
        13:[75, 540],
        14:[145, 540],
        15:[215, 540],
        16:[285, 540],
        17:[355, 540],
        18:[425, 540],
        19:[575, 540],
        20:[645, 540],
        21:[715, 540],
        22:[785, 540],
        23:[855, 540],
        24:[925, 540],
        25:[975, 200],    
    };
    mirror = {
        1:13,2:14,3:15,4:16,5:17,6:18,7:19,8:20,9:21,10:22,11:23,12:24,13:1,14:2,15:3,16:4,17:5,18:6,19:7,20:8,21:9,22:10,23:11,24:12
    }
    connected = false;
    username = "";
    socket = null;
    sessionid = null;
    exitallowed = false;
    bones = [];
    lines = [];
    chips = [];
    lineischosen = false;
    canpickhead = 1;
    chosenline = 0;

    constructor(){
        makeAutoObservable(this)
    }

    setUsername(username){
        this.username = username;
    }

    setSocket(socket){
        this.socket = socket;  
      }

    setSessionId(id){
        this.sessionid = id;
    }

    setBones(bones){
        this.bones = bones
    }

    setCanpickhead(){
        if(this.bones == [3, 3, 3, 3]
             || this.bones == [4, 4, 4, 4] 
             || this.bones == [6, 6, 6, 6]){this.canpickhead = 2}
    }

    anChooseLines(){
        this.lineischosen = false;
        this.chosenline = 0;
    }

    chooseLine(num){
        this.lineischosen = true;
        this.chosenline = num;
    }

    lOCheck(num){
        let chips = this.chips.filter(chip=>chip.line == num)
        if(chips.length > 0){
            if(chips[0].color == game.pc){
                return false
            } else {return true;}
        }
        return false
    }

    getBonesSum(c){
        let sum = 0;
        let is = [];
        for (let i = 0; i < c; i++) {
            sum += this.bones[i];
            is.push(i)
        }
        return [sum, is]
    }

    getSetofMoves(){
        let arr = [];
        // [1, 1, 1, 1] = [[1, false] * 4, [2, true] * 2, [3, true], [4, ]]
        for(let i=0; i<this.bones.length;i++){
            arr.push([this.bones[i],!this.lOCheck(this.chosenline + this.bones[i])])
        }
        if(this.bones.length == 2){
            let v = true;
            for (let i = 0; i < arr.length; i++) {
              if(arr[i][1] == false){
                v = arr[i][1]
                break
              }
            }
            if(v){
                v = this.lOCheck(this.chosenline + this.getBonesSum(2))
            }
            arr.push([this.getBonesSum(2)[0], !v])
        }
        if(this.bones.length == 4){
            let v = true;
            for (let i = 0; i < arr.length; i++) {
              if(arr[i][1] == false){
                v = arr[i][1]
                break
              }
            }
            for (let i = 2; i < 5; i++) {
                if(v){
                    v = !this.lOCheck(this.chosenline + this.getBonesSum(i)[0])
                }
                arr.push([this.getBonesSum(i)[0], v])
            }
        }
        console.log("set of moves is: ", arr);
        let c = false
        for (let i = 0; i < arr.length; i++) {
            if(arr[i][1] == true){
                c = true;
                break
            }
        }
        if(c == false){
            return [];
        } else {return arr;}
    }
    
    // getSetOfOutMoves(l){
    //     let arr = [];
    //     if(l <= bones[0] || l <= bones[1] || l <= this.getBonesSum(this.bones.length)){

    //     }
    // }
 
    checkCanGetOut(){
        let l = 25 - this.chosenline;
        if(this.exitallowed == true){
            if(l <= this.bones[0] || l <= this.bones[1] || l <= this.getBonesSum(this.bones.length)){
                console.log(l <= this.bones[0]);
                console.log(l <= this.bones[1]);
                console.log(l <= this.getBonesSum(this.bones.length));
                console.log("chekcout is true");
                return true;
            }
        }
        return false;
    }

    deleteBones(l){
        for (let i = 0; i < this.bones.length; i++) {
            if(this.bones[i] == l){
                this.bones = this.bones.filter((bone, index)=>index!=i)
                return false
            }
        }
        if(l == this.getBonesSum(this.bones.length)[0]){
            this.bones = [];
        }
        for(let i = 0; i < this.bones.length; i++){
            if(l == this.getBonesSum(i)[0]){
                for (let j = 0; j < this.getBonesSum(i)[1].length; j++) {
                    this.bones.shift()
                }
            }
        }
    }

    checkMoveValid(num){
        console.log("from checkValid func");
        console.log(this.exitallowed);
        if(this.chosenline == 1 && this.canpickhead == 0){
            return false
        }
        let l = num - this.chosenline;
        let arr = []
        if(!this.exitallowed){
            arr = this.getSetofMoves().filter(set=>set[0]==l)
            if(arr[0]){
                return arr[0][1];
            }
        }      
        if(this.exitallowed){
            console.log("exitallowed");
            if(!this.checkCanGetOut())
            {
                arr = this.getSetofMoves().filter(set=>set[0]==l)
                if(arr[0]){
                    return arr[0][1];
                }
            } else {
                if(num == 25){
                    return true
                } 
                else { return false}
                } 
            }    
    }

    deleteChip(id){
        this.chips = this.chips.filter((chip)=>chip.num!=id)
    }

    changeChipLine(msg){
        if(this.username == msg.username){
            let chip = this.chips.filter(chip=>chip.num == msg.chip_id)
            let chips = this.chips.filter(chip=>chip.num != msg.chip_id)
            chip[0].x = this.linescoords[msg.chip_nl][0]
            chip[0].line = msg.chip_nl;
            this.chips = [...chip, ...chips];
            this.checkWinGame()
        } 
        if(this.username != msg.username){
            if(msg.chip_nl == 25){
                this.deleteChip(msg.chip_id);
                return false;
            }
            let chip_nl = this.mirror[msg.chip_nl]
            let chip = this.chips.filter(chip=>chip.num == msg.chip_id)
            let chips = this.chips.filter(chip=>chip.num != msg.chip_id)
            chip[0].x = this.linescoords[chip_nl][0]
            chip[0].line = chip_nl;
            this.chips = [...chip, ...chips];
        }
    }

    moveChip(num){
        let l = num - this.chosenline;
        let chips = this.chips.filter(chip=>chip.line == this.chosenline)
        this.checkExitAllow()
        if(num == 25 && this.exitallowed == false){
            this.lineischosen = false;
            this.chosenline = 0;
            return false
        }
        if(chips.length > 0 && chips[0].color == game.pc && this.checkMoveValid(num)){
            if(this.chosenline > 0){
                this.canpickhead -= 1;
            }
            this.deleteBones(l)
            if(num == 25){this.bones = []}
            this.socket.send(JSON.stringify({
                id:this.sessionid,
                username:this.username,
                method:"move",
                chip_id:chips[0].num,
                chip_nl:num,
            }))
            if(this.getSetofMoves().length == 0){
                this.changeTurn()
            }
        }   
        this.lineischosen = false;
        this.chosenline = 0;
        this.checkWinGame()
    }

    changeTurn(){
        let color = ""
        if(game.pc == "white"){
            color = "black"
            }
        if(game.pc == "black"){
            color = "white"
            }
        this.canpickhead = 1;
        this.socket.send(JSON.stringify({
            id:this.sessionid,
            method:"changeturn",
            color:color,
        }))
    }

    checkExitAllow(){
        let color_sort = this.chips.filter((chip)=>chip.color == game.pc)
        console.log("from checkAllow func");
        if(color_sort.filter((chip)=>chip.line < 19).length == 0){
           this.exitallowed = true
        }
    }

    checkWinGame(){
        let color_sort = this.chips.filter((chip)=>chip.color == game.pc)
        if(color_sort.filter((chip)=>chip.line < 25).length == 0){
            this.winGame()
        }
    }

    winGame(){
        this.socket.send(JSON.stringify({
            id:this.sessionid,
            method: "win",
            username:this.username,
            color:this.color,
        }))
    }

    takeSeat(color){
        if(this.connected){
            this.socket.send(JSON.stringify({
                id:this.sessionid,
                username: this.username,
                method: "sit",
                color:color,
              }))
        }   
    }

    linesHeightSort(){
        this.lines.forEach((line)=>{
            let chipsonline = this.chips.filter((chip)=>chip.line == line.num);
            if(line.num <= 12){
                for(let i = 0; i < chipsonline.length; i++){
                    chipsonline[i].y = 60 + 15 * i;
                }
            }
            if(line.num > 12){
                for(let i = 0; i < chipsonline.length; i++){
                    chipsonline[i].y = 540 - 15 * i;
                }
            }
        })
    }

    init(){
        if(game.pc == "white"){
            for (let i = 0; i < 1; i++) {
                this.chips.push(new Chip(i,this.linescoords[13][0], 540, 13,"black"))
                this.chips.push(new Chip(30-i,this.linescoords[1][0], 60, 1,"white"))
        }}
        if(game.pc == "black"){
            for (let i = 0; i < 1; i++) {
                this.chips.push(new Chip(i,this.linescoords[1][0], 540, 1,"black"))
                this.chips.push(new Chip(30-i,this.linescoords[13][0], 60, 13,"white"))
        }}
        for (let i = 1; i < 25; i++) {
            let x, y, width, height = 0;
            x = this.linescoords[i][0] - 35;
            width = 70;
            height = 270;
            if(i <= 12){
                y = 0 + 30;
            }
            if(i > 12){
                y = 600 - 300;
            }
            this.lines.push(new Line(i, x, y, width, height))
        }
        for (let i = 25; i < 26; i++){
            let x, y, width, height = 0;
            height = 200;
            width = 50;
            x = this.linescoords[i][0] - 35;
            y = 200;
            this.lines.push(new Line(i, x, y, width, height))
        }
        // this.lines.forEach((line)=>{
        //     this.chips.forEach((chip)=>{
        //         if(chip.line == line.num){
        //             line.chips.push(chip)
        //         }
        //     })
        // })
    }
}

export default new Board()