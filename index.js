/**
 * @namespace Konva
 */

const height = 400, width = 400, interval = 40;

let gidCoords

let stage = new Konva.Stage({
  container: 'container',
  width,
  height,
});

let gridLayer = new Konva.Layer();

for (let x = 0; x <= width; x += interval) {
  let gridLine = new Konva.Line({
    points: [x, 0, x, height],
    stroke: 'black',
    strokeWidth: 1
  });
  gridLayer.add(gridLine);
}

for (let y = 0; y <= height; y += interval) {
  let gridLine = new Konva.Line({
  points: [0, y, width, y],
    stroke: 'black',
    strokeWidth: 1
  });
  gridLayer.add(gridLine);
}

let selectionLayer = new Konva.Layer();
let selectionCircle = new Konva.Circle({
  x: 0,
  y: 0,
  radius: 10,
  stroke: 'cyan',
  strokeWidth: 5,
});
selectionLayer.add(selectionCircle);

stage.on('pointermove', () => {
  let { x, y } = stage.getPointerPosition();
  x = Math.round(x / interval) * interval;
  y = Math.round(y / interval) * interval;
  selectionCircle.absolutePosition({ x, y });
});
stage.on('pointerdown', () => {
  
})

gridLayer.add(selectionCircle);

stage.add(gridLayer);

