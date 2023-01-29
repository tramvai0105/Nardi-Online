
export class Line{
    constructor(num, x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.num = num;
        this.chips = []
        this.chosen = false;
        this.stroke = "black"
    }
    // chipHeightSort(){
    //     if(this.num <= 12){
    //         // this.chips.forEach(chip=>chip.y = 60)
    //     }
    //     if(this.num > 23){
    //         for(let i = 0; i < this.chips.length; i++){
    //             console.log(this.chips[i])
    //         }
    //     }
    //     // if(this.num <= 12){
    //     //     for(let i = 0; i < this.chips.length; i++){
    //     //         this.chips[i].y = 60 + 15 * i
    //     //     }
    //     // }
    //     // if(this.num > 12){
    //     //     for(let i = 0; i < this.chips.length; i++){
    //     //         this.chips[i].y = 540 - 15 * i
    //     //     }
    //     // }
    // }
}