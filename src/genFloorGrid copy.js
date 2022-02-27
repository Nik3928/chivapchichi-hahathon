const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let data = {};
const genButton = document.querySelector('#gen');
genButton.addEventListener('click', () => {
    const inputData = document.querySelectorAll('input[data-property]');
    for (const dataElement of inputData) {
        data[dataElement.id] = dataElement.value;
    }
    console.log(data);
    const container = document.querySelector("#gridContainer");
    container.innerHTML = '';

    let selectionMode = 'room';
    let floors = [];
    let selectionModeStatus = document.createElement('span');
    selectionModeStatus.innerHTML = selectionMode;
    container.appendChild(selectionModeStatus);
    // let cableButtons = [];
    container.innerHTML += `<input type="radio" name="radioGroup" id="room" style="margin-right: 3px" checked>room`;
    for (let i = 0; i < data.cables; i++) {
        // container.innerHTML += `<button id="${alphabet[i]}" style="margin-right: 3px">${alphabet[i]}</button>`;
        let cableType = alphabet[i];
        let button = document.createElement('input');
        button.type = "radio";
        button.id = cableType;
        button.name = "radioGroup";
        button.setAttribute('style', "margin-right: 3px");
        // cableButtons.push(button);
        container.innerHTML += button.outerHTML + cableType;
        const cableButtons = document.querySelectorAll('input[name="radioGroup"]');
        button.addEventListener('change', () => {
            for (const cButton of cableButtons) {
                if (cButton.checked) selectionMode = button.id;
            }
            console.log(selectionMode);
            if (selectionMode == cableType)
                selectionMode = 'room';
            else
                selectionMode = cableType;
            console.log(selectionMode);
            floors.forEach((grid) => grid.setSelectionMode(selectionMode));
            selectionModeStatus.innerHTML = selectionMode;
        });
        // let input = document.createElement('input');
        // input.type = "number";
        // cableButtons = document.querySelectorAll('#A');

        
            
    }

    for (let i = 1; i <= data.nFloors; i++) {
        container.innerHTML += `
        <br> <p>Floor №${i}</p> 
        <input type="number" name="size" id="floorHeight${i}" min="2" max="30" step="1" value="2">
        <label for="floorHeight${i}">floor height</label>
        <div id="container${i}">Floor №${i}</div>
        `;
    }
    for (let i = 1; i <= data.nFloors; i++) {
        floors.push(new Grid(
            data.length / 1000 > 1 ? data.length / 1000 * interval : data.length * interval,
            data.width / 1000 > 1 ? data.width / 1000 * interval : data.width * interval,
            `container${i}`
        ));
        // console.log(floors);
    }

})

