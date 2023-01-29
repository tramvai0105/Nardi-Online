
const Bones = ({firstnum, secondnum}) => {


    return (
        <div className="bones">
            <div className="bone">
                <h1 className="num">{firstnum}</h1>
            </div>
            <div className="bone">
                <h1 className="num">{secondnum}</h1>
            </div>
        </div>
        
    )
}

export default Bones;