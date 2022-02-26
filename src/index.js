const height = 400, width = 400, interval = 40;

let absoluteToGrid = ({ x, y }) => {
  x = Math.round(x / interval);
  y = Math.round(y / interval);
  return { x, y };
};

let gridCoordsAbsolute = ({ x, y }) => {
  x = Math.round(x / interval) * interval;
  y = Math.round(y / interval) * interval;
  return { x, y };
};

let gridToAbsolute = ({ x, y }) => {
  x *= interval;
  y *= interval;
  return { x, y };
}

// let posParse = (pos1, pos2) => {
//   return {pos1: {x: Math.min(pos1.x, pos2.x), y: Math.min(pos1.y, pos2.y)}, 
//   pos2: {x: Math.max(pos1.x, pos2.x), y: Math.max(pos1.y, pos2.y)}}
// };

// let selectionPointInRoom = (x, y) => {
//   let temp, pos1_, pos2_;
//   for (let i = 0; i < rooms.length; i++) {
//     temp = posParse(rooms[i].pos1, rooms[i].pos2);
//     pos1_ = temp.pos1; pos2_ = temp.pos2;
//     if (x > pos1_.x && y > pos1_.y && x < pos2_.x && y < pos2_.y) {
//       // console.log(x, y, pos1_.x, pos1_.y, pos2_.x, pos2_.y);
//       return true
//     }
//   }
//   return false
// };

// let roomInRoom = (pos1, pos2) => {
//   let temp = posParse(pos1, pos2);
//   let pos1_, pos2_;
//   pos1 = temp.pos1; pos2 = temp.pos2;
//   for (let i = 0; i < rooms.length; i++) {
//     temp = posParse(rooms[i].pos1, rooms[i].pos2);
//     pos1_ = temp.pos1; pos2_ = temp.pos2;

//     if (pos1.x < pos1_.x && pos1.y < pos1_.y && pos2.x > pos2_.x && pos2.y > pos2_.y) {
//       return true
//     }
//     return false
//   }
// };

let stage = new Konva.Stage({
  container: 'container',
  width,
  height,
});

let layer = new Konva.Layer();

for (let x = 0; x <= width; x += interval) {
  let gridLine = new Konva.Line({
    points: [x, 0, x, height],
    stroke: 'blue',
    strokeWidth: 1
  });
  layer.add(gridLine);
}

for (let y = 0; y <= height; y += interval) {
  let gridLine = new Konva.Line({
    points: [0, y, width, y],
    stroke: 'blue',
    strokeWidth: 1
  });
  layer.add(gridLine);
}

let selectionLayer = new Konva.Layer();
let hoverCircle = new Konva.Circle({
  x: 0,
  y: 0,
  radius: 10,
  stroke: 'cyan',
  strokeWidth: 5,
});
selectionLayer.add(hoverCircle);

let rooms = [];

let selectionPoint; // {gridX: int, gridY: int, point: Konva.Point}

stage.on('pointermove', () => {
  let pos = stage.getPointerPosition();
  pos = gridCoordsAbsolute(pos);
  hoverCircle.absolutePosition(pos);
});

const startSelection = (pos) => {
  let point = hoverCircle.clone();
  selectionPoint = {
    pos,
    point
  }
  selectionLayer.add(point);
  hoverCircle.stroke('red');
}

const resetSelection = () => {
  selectionPoint.point.destroy();
  selectionPoint = null;
  hoverCircle.stroke('cyan');
}

const finishSelection = (pos2) => {
  hoverCircle.stroke('cyan');
  let room = {
    pos1: selectionPoint.pos,
    pos2
  };
  rooms.push(room);
  selectionPoint.point.destroy();
  selectionPoint = null;

  let createRoomLine = (pos1, pos2) => new Konva.Line({
    points: [pos1.x, pos1.y, pos2.x, pos2.y],
    stroke: 'black',
    strokeWidth: 3
  });
  let absPos1 = gridToAbsolute(room.pos1), absPos2 = gridToAbsolute(room.pos2);
  let top = createRoomLine({ x: absPos1.x, y: absPos1.y }, { x: absPos2.x, y: absPos1.y });
  selectionLayer.add(top);
  let right = createRoomLine({ x: absPos2.x, y: absPos1.y }, { x: absPos2.x, y: absPos2.y });
  selectionLayer.add(right);
  let bottom = createRoomLine({ x: absPos2.x, y: absPos2.y }, { x: absPos1.x, y: absPos2.y });
  selectionLayer.add(bottom);
  let left = createRoomLine({ x: absPos1.x, y: absPos2.y }, { x: absPos1.x, y: absPos1.y });
  selectionLayer.add(left);

  // console.log(rooms);
}

stage.on('pointerdown', () => {
  let pos = absoluteToGrid(stage.getPointerPosition());
  //if (!selectionPointInRoom(pos.x, pos.y)) {
    if (!selectionPoint) {
      startSelection(pos);
    } else {
      if (selectionPoint.pos.x == pos.x || selectionPoint.pos.y == pos.y) {
        resetSelection();
      } else {//if (!roomInRoom(pos, selectionPoint.pos)) {
        finishSelection(pos);
      }
    }
  //}
});

let container = stage.container();
container.tabIndex = 1;
container.focus();
container.addEventListener('keydown', (event) => {
  if (event.keyCode === 67) {
    console.log("cleared");
    selectionLayer.destroyChildren();
    rooms = [];
    selectionPoint = null;
    hoverCircle.stroke('cyan');
  }
  event.preventDefault();
});

layer.add(hoverCircle);

stage.add(layer);
stage.add(selectionLayer);

