export class Chip{
    constructor(num,x, y, line, color){
        this.num = num
        this.x = x
        this.y = y
        this.line = line
        this.radius = 30
        this.color = color
        if(color==="white"){
            this.fill="#ccffff"
            this.stroke="black"
        }
        if(color==="black"){
            this.fill="black"
            this.stroke="#f1daff"
        }
    }
}