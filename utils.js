import Module from "./main.js"
import {createNodes, createLabels, giveStyle, renderGraph, states, g, showPath} from "./graph.js"
const N = 2

//const matrix = (rows, cols) => new Array(cols).fill(0).map((o, i) => new Array(rows).fill(0))

const getMatrixValues = () => {
  let nCities = $(".cells-input").length / 2;
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
      let inputText = `<input type="text" class="form-control mx-0 rounded-0 text-center cells-input" name="" id="cell-${row}${col}">`
      let cellClass = "ratio ratio-1x1"
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
  const matrixMemory = myModule._calloc(N, 4);
  for (let i = 0; i < N; i++) {
    let row = myModule._calloc(N, 4);
    myModule.setValue(matrixMemory + i * 4, row, "i32");
    for (let j = 0; j < N; j++) {
      myModule.setValue(row + j * 4, matrix[i][j], "i32");
    }
  }
  return matrixMemory
}

const sendPath = (myModule) => {
  let path = myModule._calloc(N, 4);
  return path;
}


// Get the result from the "C script"
// completar función
const getPath = (myModule, pathMemory) => {
  let resultPath = Array(10);
    for (let j = 0; j < N; j++) {
      resultPath[j] =  myModule.getValue(pathMemory + j * 4, "i32");
    }
  return resultPath;
}

// const resetBtn = document.getElementById("reset-btn");
// resetBtn.onclick = () => {
//   resetSudokuGrid();
// }

Module().then(function (mymod) {
  // let solveBtn = document.getElementById("solve-btn");
  // solveBtn.onclick = () => {
    //let arrPtr = makePtrOfArray(mymod);
    let buildInputBtn = document.getElementById("calc-btn")
    buildInputBtn.onclick = () => {
    let nCities = $("#fib-n").val();
    setMatrixInput(Number(nCities));
    }

    let calcBtn = document.getElementById("calc-tsp")
    calcBtn.onclick = () => {
      let matrix = getMatrixValues();
      let nCities = $("#fib-n").val();
      createNodes(states, nCities);
      createLabels(matrix, g);
      giveStyle();
      renderGraph();
      let memoryMatrix = sendMatrix(mymod, matrix);
      let memoryPath = sendPath(mymod);
      let startDate = window.performance.now();
      let distance = mymod._mincost(0, memoryMatrix, memoryPath, 0);
      //let solverResult = mymod._SolveSudoku(arrPtr);
      let endDate = window.performance.now();
      let resultPath = getPath(mymod, memoryPath);
      let testPath = ["B", "A"];
      showPath(testPath);
      // Ahora hay que reflejar los cambios en html
      //setSudokuGrid(resultMatrix);
      console.log(`La distancia minima es: ${distance} Excecution time: ${(endDate - startDate)} ms ${resultPath}`);
        
    }

    
  // }
})

