const interval = 40;

const absoluteToGrid = ({ x, y }) => {
  x = Math.round(x / interval);
  y = Math.round(y / interval);
  return { x, y };
};

const gridCoordsAbsolute = ({ x, y }) => {
  x = Math.round(x / interval) * interval;
  y = Math.round(y / interval) * interval;
  return { x, y };
};

const gridToAbsolute = ({ x, y }) => {
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

const visible = (layer, visible) => {
  layer.getChildren().forEach((child) => {
    if (visible)
      child.alpha(0);
    else
      child.alpha(255);
  });
}


class Grid {
  walls = []; // [ { pos1: {...}, pos2: {...} } ]
  restrictedWalls = []; // [ { type: char, pos1: {...}, pos2: {...} } ]
  receivers = []; // [ { pos: {...} } ]
  source;

  selectionMode = 'room';

  gridLayer = new Konva.Layer();
  deviceLayer = new Konva.Layer();
  roomLayer = new Konva.Layer();
  restrictedWallLayers = {};

  constructor(height, width, container_name) {
    this.stage = new Konva.Stage({
      container: container_name,
      width,
      height,
    });

    for (let x = 0; x <= width; x += interval) {
      let gridLine = new Konva.Line({
        points: [x, 0, x, height],
        stroke: 'blue',
        strokeWidth: 1
      });
      this.gridLayer.add(gridLine);
    }

    for (let y = 0; y <= height; y += interval) {
      let gridLine = new Konva.Line({
        points: [0, y, width, y],
        stroke: 'blue',
        strokeWidth: 1
      });
      this.gridLayer.add(gridLine);
    }

    this.hoverCircle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 10,
      stroke: 'cyan',
      strokeWidth: 5,
    });
    this.roomLayer.add(this.hoverCircle);

    //this.selectionPoint; // {gridX: int, gridY: int, point: Konva.Point}

    this.stage.on('pointermove', () => this.#handlePointerMove());

    this.stage.on('pointerdown', () => this.#handlePointerDown());


    let container = this.stage.container();
    container.tabIndex = 1;
    container.focus();
    container.addEventListener('keydown', (event) => {
      if (event.keyCode === 67) { // 'c'
        console.log("cleared");
        this.roomLayer.destroyChildren();
        Object.values(this.restrictedWallLayers).forEach((layer) => layer.destroyChildren());
        this.deviceLayer.destroyChildren();
        this.walls = [];
        this.restrictedWalls = {};
        this.source = undefined;
        this.receivers = [];
        this.selectionPoint = undefined;
        this.hoverCircle.stroke('cyan');
      }
      event.preventDefault();
    });

    this.gridLayer.add(this.hoverCircle);

    this.stage.add(this.gridLayer);
    this.stage.add(this.roomLayer);
    this.stage.add(this.deviceLayer);
  }

  #handlePointerMove() {
    let pos = this.stage.getPointerPosition();
    pos = gridCoordsAbsolute(pos);
    this.hoverCircle.absolutePosition(pos);
  }

  #handlePointerDown() {
    let pos = absoluteToGrid(this.stage.getPointerPosition());
    //if (!selectionPointInRoom(pos.x, pos.y)) {
    if (!this.selectionPoint) {
      this.startSelection(pos);
    } else {
      //      if (this.selectionPoint.pos.x == pos.x || this.selectionPoint.pos.y == pos.y) {
      //        this.resetSelection();
      //      } else {//if (!roomInRoom(pos, selectionPoint.pos)) {
      //        this.finishSelection(pos);
      //      }
      this.finishSelection(pos);
    }
    //}
  }

  setSelectionMode(mode) {
    this.resetSelection();
    this.selectionMode = mode;
    if (mode.startsWith('rwall')) {
      let currentLayer = this.restrictedWallLayers[mode];
      if (!currentLayer) {
        currentLayer = new Konva.Layer();
        this.restrictedWallLayers[mode] = currentLayer;
        this.stage.add(currentLayer)
      }
      Object.values(this.restrictedWallLayers).forEach((layer) => layer.hide());
      currentLayer.show();
    } else {
      Object.values(this.restrictedWallLayers).forEach((layer) => layer.hide());
    }
  }

  startSelection(pos) {
    let point = this.hoverCircle.clone();
    this.selectionPoint = {
      pos,
      point
    }
    this.roomLayer.add(point);
    this.hoverCircle.stroke('red');
  }

  resetSelection() {
    this.selectionPoint?.point?.destroy();
    this.selectionPoint = null;
    this.hoverCircle.stroke('cyan');
  }

  makeRoom(pos2) {
    const createWall = (pos1, pos2) => {
      let absPos1 = gridToAbsolute(pos1),
        absPos2 = gridToAbsolute(pos2);
      let line = new Konva.Line({
        points: [absPos1.x, absPos1.y, absPos2.x, absPos2.y],
        stroke: 'black',
        strokeWidth: 3
      });
      this.roomLayer.add(line);
      this.walls.push({ pos1, pos2 });
    }

    let pos1 = this.selectionPoint.pos;

    if (pos1.x != pos2.x && pos1.y != pos2.y) {
      createWall({ x: pos1.x, y: pos1.y }, { x: pos2.x, y: pos1.y });
      createWall({ x: pos2.x, y: pos1.y }, { x: pos2.x, y: pos2.y });
      createWall({ x: pos2.x, y: pos2.y }, { x: pos1.x, y: pos2.y });
      createWall({ x: pos1.x, y: pos2.y }, { x: pos1.x, y: pos1.y });
    }
  }

  makeRestrictedWall(pos2) {
    /*
 *    ==== ЭТО ПИЗДЕЦ, НЕ ТРОГАЙ ====
 */
    const createResrictedWall = (pos1, pos2) => {
      let absPos1 = gridToAbsolute(pos1),
        absPos2 = gridToAbsolute(pos2);
      let line = new Konva.Line({
        points: [absPos1.x, absPos1.y, absPos2.x, absPos2.y],
        stroke: 'red',
        strokeWidth: 3
      });
      this.restrictedWallLayers[this.selectionMode].add(line);
      this.restrictedWalls.push({ pos1, pos2, type: this.selectionMode });
    }

    let pos1 = this.selectionPoint.pos;
    if (pos1.x == pos2.x) {
      let x = pos1.x;
      let [yMin, yMax] = [pos1.y, pos2.y].sort((a, b) => a - b);
      this.walls
        .filter((wall) => wall.pos1.x == x && wall.pos2.x == x)
        .forEach((wall) => {
          let [wallYMin, wallYMax] = [wall.pos1.y, wall.pos2.y].sort((a, b) => a - b);
          let rwallYMin = Math.max(yMin, wallYMin),
            rwallYMax = Math.min(yMax, wallYMax);
          if (rwallYMax - rwallYMin > 0)
            createResrictedWall({ x, y: rwallYMin }, { x, y: rwallYMax });
        });
    } else if (pos1.y == pos2.y) {
      let [xMin, xMax] = [pos1.x, pos2.x].sort((a, b) => a - b);
      let y = pos1.y;
      this.walls
        .filter((wall) => wall.pos1.y == y && wall.pos2.y == y)
        .forEach((wall) => {
          let [wallXMin, wallXMax] = [wall.pos1.x, wall.pos2.x].sort((a, b) => a - b);
          let rwallXMin = Math.max(xMin, wallXMin),
            rwallXMax = Math.min(xMax, wallXMax);
          if (rwallXMax - rwallXMin > 0)
            createResrictedWall({ x: rwallXMin, y }, { x: rwallXMax, y });
        });
    }
  }

  makeDevice(pos2, color) {
    let pos1 = this.selectionPoint.pos;
    if (Math.abs(pos1.x - pos2.x) == 1 && Math.abs(pos1.y - pos2.y) == 1) {
      let x = (pos1.x + pos2.x) / 2,
        y = (pos1.y + pos2.y) / 2;
      let rectangleSize = 0.75 * interval;
      let absPos = gridToAbsolute({ x, y });
      let rectangle = new Konva.Rect({
        x: absPos.x - rectangleSize / 2,
        y: absPos.y - rectangleSize / 2,
        width: rectangleSize,
        height: rectangleSize,
        fill: color,
      });
      this.deviceLayer.add(rectangle);
      return {
        pos: { x, y },
        rectangle
      }
    }
  }

  makeReceiver(pos2) {
    let receiver = this.makeDevice(pos2, 'green');
    if (receiver) {
      let receiverID = Number(this.selectionMode.substring('receiver_'.length));
      this.receivers[receiverID]?.rectangle?.destroy();
      this.receivers[receiverID] = receiver;
    }
  }

  makeSource(pos2) {
    let source = this.makeDevice(pos2, 'orange');
    if (source) {
      this.source?.rectangle.destroy();
      this.source = source;
    }
  }

  finishSelection(pos2) {
    if (this.selectionMode == 'room') {
      this.makeRoom(pos2);
    } else if (this.selectionMode.startsWith('rwall')) {
      this.makeRestrictedWall(pos2);
    } else if (this.selectionMode.startsWith('receiver')) {
      this.makeReceiver(pos2);
    } else if (this.selectionMode == 'source') {
      this.makeSource(pos2);
    }

    this.resetSelection();

    // console.log(rooms);
  }

}
// let gr = new Grid(400, 400, 'containerOfGrids1')
// let gr_ = new Grid(400, 400, 'containerOfGrids2')
