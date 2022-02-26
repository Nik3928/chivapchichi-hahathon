/**
 * @namespace Konva
 */

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

  console.log(rooms);
}

stage.on('pointerdown', () => {
  let pos = absoluteToGrid(stage.getPointerPosition());
  if (!selectionPoint) {
    startSelection(pos);
  } else {
    if (selectionPoint.pos.x == pos.x || selectionPoint.pos.y == pos.y) {
      resetSelection();
    } else {
      finishSelection(pos);
    }
  }
});

layer.add(hoverCircle);

stage.add(layer);
stage.add(selectionLayer);

