import {Circle} from 'react-konva'

const ChipComp = ({x, y, fill, stroke}) => {

  return (
        <Circle 
        x={x} y={y} 
        radius={30} 
        fill={fill} 
        stroke={stroke}
        />
  );
}

export default ChipComp;