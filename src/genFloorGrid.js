let data = {};
const genButton = document.querySelector('#gen');
genButton.addEventListener('click', () => {
    const inputData = document.querySelectorAll('input[type="number"]');
    for (const dataElement of inputData) {
        data[dataElement.id] = dataElement.value;
    }
    console.log(data);
    const container = document.querySelector("#containerOfGrids");
    let inner = ``;
    for (let i = 1; i <= data.nFloors; i++) {
        inner += `<div id="${i}">Floor №${i}</div>`;
    }
    container.innerHTML = inner
})

