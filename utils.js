import Module from "./glue.js";
import {createNodes, createLabels,
        giveStyle, renderGraph,
        states, g, showPath} from "./graph.js";

  
const getMatrixValues = () => {
  let nCities = $(".cells-input").length;
  console.log("ncities: ", nCities);
  let tspMatrix = new Array(nCities).fill(0).map( () => new Array(nCities).fill(0))
  $('.cells-input').each((i, obj) => {
    $(obj).val() != "" ? tspMatrix[Number(obj.id.charAt(5))][Number(obj.id.charAt(6))] = Number($(obj).val()) : {};
  });
  return tspMatrix;
}


const setMatrixInput = (range) => {
  $("#matrix-input").empty();
  for (let row = 0; row < range; row++) {
    $("#matrix-input").append(`<div class="d-flex flex-row" id="row-${row}"></div>`);
    for (let col = 0; col < range; col++){
      let inputText = `<input type="text" class="form-control mx-0 rounded-0 text-center cells-input" name="" id="cell-${row}${col}">`;
      let cellClass = "ratio ratio-1x1";
      row === 0 ? cellClass += " border-top" : {};
      col === 0 ? cellClass += " border-start" : {};
      row === range - 1 ? cellClass += " border-bottom" : {};
      col === range -1 ? cellClass += " border-end" : {};
      row === 0 || col === 0 || row === range - 1 || col === range - 1 ? cellClass += " border-3 border-dark" : {};
      let cellElement = `<div class="${cellClass}">${inputText}</div>`;
      $(`#row-${row}`).append(cellElement);
    }
  }
}


// Send the matrix of cities to the "C script"
const sendMatrix = (myModule, matrix) => {
  let nCities = $(".cells-input").length;
  const matrixMemory = myModule._calloc(nCities, 4);
  for (let i = 0; i < nCities; i++) {
    let row = myModule._calloc(nCities, 4);
    myModule.setValue(matrixMemory + i * 4, row, "i32");
    for (let j = 0; j < nCities; j++) {
      myModule.setValue(row + j * 4, matrix[i][j], "i32");
    }
  }
  return matrixMemory
}


// Pide memoria para el arreglo del camino mas corto
const sendPath = (myModule) => {
  let nCities = $(".cells-input").length;
  let path = myModule._calloc(nCities, 4);
  return path;
}


// Get the result from the "C script"
// completar función
const getPath = (myModule, pathMemory) => {
  let nCities = $(".cells-input").length;
  let resultPath = Array(nCities).fill(0);
  for (let j = 0; j < nCities; j++) {
    resultPath[j] =  myModule.getValue(pathMemory + j * 4, "i32");
  }
  return resultPath;
}

const addRowTable = (nCities, time) => {
  const table = document.getElementById("result-table");
  let row = table.insertRow(-1);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  cell1.innerHTML = `${nCities}`;
  cell2.innerHTML = `${time} ms`;
}

// Ejecución de programa principal
Module().then(function (mymod) {

    let buildInputBtn = document.getElementById("calc-btn")
    buildInputBtn.onclick = () => {
      let nCities = $("#fib-n").val();
      setMatrixInput(Number(nCities));
    }

    let calcBtn = document.getElementById("calc-tsp")
    calcBtn.onclick = () => {
      let matrix = getMatrixValues();
      let nCities = $("#fib-n").val();
      let nCitiesAux = nCities;
      createNodes(states, nCities);
      createLabels(matrix, g);
      giveStyle();
      renderGraph();
      let memoryMatrix = sendMatrix(mymod, matrix);
      let memoryPath = sendPath(mymod);
      let memoryCompleted = sendPath(mymod);
      let memoryCost = mymod._calloc(1, 4);
      let startDate = window.performance.now();
      mymod._mincost(0, memoryMatrix, memoryPath, 0, memoryCompleted, memoryCost, nCities);
      let endDate = window.performance.now();
      let resultPath = getPath(mymod, memoryPath);
      let cost = mymod.getValue(memoryCost, "i32");
      nCitiesAux++;
      let resultPath2 = resultPath.slice(0, nCitiesAux);
      showPath(resultPath2);
      nCitiesAux--;
      addRowTable(nCitiesAux, endDate - startDate);
      console.log(`La distancia minima es: ${'a'} Excecution time: ${(endDate - startDate)} ms ${resultPath}, ${cost}`);
    }
})

