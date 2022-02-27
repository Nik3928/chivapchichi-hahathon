const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const sendData = (floors, data) => {
    let walls = [];
    let source;
    let receivers = [];
    let heights = [];
    let restrictedWalls = {};
    for (let i = 0; i < floors.length; i++) {
        heights.push(floors[i].floorHeight);
        let grid = floors[i].grid
        grid.walls
            .map((wall) => [wall.pos1.x, wall.pos1.y, wall.pos2.x, wall.pos2.y, i])
            .forEach(wall => walls.push(wall));
        grid.receivers
            .map((receiver) => [receiver.pos.x, receiver.pos.y, i])
            .forEach(receiver => receivers.push(receiver));
        grid.restrictedWalls.forEach((rwall) => {
            if (!restrictedWalls[rwall.type])
                restrictedWalls[rwall.type] = []
            restrictedWalls[rwall.type].push([rwall.pos1.x, rwall.pos1.y, rwall.pos2.x, rwall.pos2.y, i]);
        });
        if (grid.source)
            source = [grid.source.pos.x, grid.source.pos.y, i];
    }
    let postData = {
        walls,
        source,
        receivers,
        restrictedWalls,
        size: [data.size.length, data.size.width, data.size.floorWidth, floors.length],
        heights
    }
    fetch("/pf", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).then(async (data) => {
        let json = await data.json();
        for (let [nodeType, routes] of Object.entries(json)) {
            console.log(`nodeType: ${nodeType}, routes: ${routes}`);
            console.log(routes);
            for (let route of Object.values(routes)) {
                let {
                    path
                } = route;
                let currentFloor = path[0][2];
                let i = 0;
                while (i < path.length) {
                    console.log(path);
                    console.log(i)
                    let lines = [];
                    currentFloor = path[i][2];
                    while (i < path.length && currentFloor == path[i][2]) {
                        console.log("-")
                        console.log(path);
                        console.log(i)
                        lines.push(path[i]);
                        i++;
                    }
                    floors[currentFloor].grid.drawRoute(nodeType, lines);
                }
            }
        }
    })
    // console.log(postData);
}

let data = {};
const genButton = document.querySelector('#gen');
genButton.addEventListener('click', () => {
    const inputData = document.querySelectorAll('input[data-property]');
    for (const dataElement of inputData) {
        data[dataElement.id] = dataElement.value;
    }
    let scale = Number(document.querySelector("input[name=units]:checked").value);
    let {
        length,
        width,
        floorWidth
    } = data;
    length /= scale;
    width /= scale;
    floorWidth /= scale;

    console.log(data);
    const container = document.querySelector("#gridContainer");
    container.innerHTML = '';

    let selectionMode = 'room';
    let floors = [];
    let selectionModeStatus = document.createElement('p');
    selectionModeStatus.innerHTML = 'Room';
    container.appendChild(selectionModeStatus);
    const createNodeButton = (name, nodeType) => {
        if (!nodeType)
            nodeType = name;
        let button = document.createElement('button');
        button.id = nodeType;
        button.setAttribute('style', "margin-right: 3px");
        button.innerHTML = name;
        button.addEventListener('click', () => {
            console.log(selectionMode);
            if (selectionMode == nodeType)
                selectionMode = 'room';
            else
                selectionMode = nodeType;
            console.log(selectionMode);
            floors.forEach((floor) => floor.grid.setSelectionMode(selectionMode));
            selectionModeStatus.innerHTML = selectionMode == 'room' ? 'Room' : name;
        });
        container.appendChild(button);
    }
    for (let i = 0; i < data.cables; i++) {
        let nodeType = alphabet[i];
        createNodeButton(nodeType, `rwall_${nodeType}`);
    }
    for (let i = 0; i < data.receivers; i++) {
        createNodeButton(`Receiver ${i + 1}`, `receiver_${i}`);
    }
    createNodeButton('Source', 'source')
    for (let i = 0; i < data.floorCount; i++) {
        container.insertAdjacentHTML('beforeend', `
        <br> <p>Floor №${i + 1}</p> 
        <input type="number" name="size" id="floorHeight${i}" min="2" max="30" step="1" value="2">
        <label for="floorHeight${i}">Floor height</label>
        <div id="container${i}">Floor №${i}</div>
        `);
        let floorHeightField = document.getElementById(`floorHeight${i}`);
        floorHeightField.oninput = () => {
            floors[i].floorHeight = Number(floorHeightField.value);
        }
        floors.push({
            floorHeight: Number(floorHeightField.value),
            grid: new Grid(
                length * interval,
                width * interval,
                `container${i}`
            )
        });
    }
    container.insertAdjacentHTML('beforeend', '<br>');
    let sendButton = document.createElement('button');
    sendButton.innerHTML = 'Send! UwU';
    sendButton.onclick = () => {
        sendData(floors, {
            size: {
                length,
                width,
                floorWidth
            }
        })
    }
    container.appendChild(sendButton);
    //for (let i = 1; i <= data.floorCount; i++) {
    //}

})