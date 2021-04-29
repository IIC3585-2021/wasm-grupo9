import Module from "./main.js"
const N = 2

const matrix = (rows, cols) => new Array(cols).fill(0).map((o, i) => new Array(rows).fill(0))

const getSudokuGrid = () => {
  let sudokuMatrix = matrix(9, 9);
  $('.form-control').each(function(i, obj) {
    sudokuMatrix[obj.id.charAt(0)][obj.id.charAt(1)] = $(obj).val() == "" ? 0 : parseInt($(obj).val());
  });
  return sudokuMatrix;
}

const setSudokuGrid = (resultMatrix) => {
  $('.form-control').each(function(i, obj) {
    $(obj).val(resultMatrix[obj.id.charAt(0)][obj.id.charAt(1)])
  })
}

const setMatrixInput = (range) => {
  $("#matrix-input").empty();
  for (let row = 0; row < range; row++) {
    $("#matrix-input").append(`<div class="d-flex flex-row" id="row-${row}"></div>`);
    for (let col = 0; col < range; col++){
      let inputText = `<input type="text" class="form-control mx-0 rounded-0 text-center" name="" id="cell-${row}${col}">`
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




const resetSudokuGrid = () => {
  $('.form-control').each(function(i, obj) {
    $(obj).val("");
  })
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

    let solveBtn = document.getElementById("calc-btn")
  solveBtn.onclick = () => {
    let nCities = $("#fib-n").val();
    setMatrixInput(Number(nCities));
    console.log("saluditos");
  }
    //setMatrixInput(10);
    let matrix = [[1,2], [3,4]]; // Obtener matriz de costos desde html
    let memoryMatrix = sendMatrix(mymod, matrix);
    let memoryPath = sendPath(mymod);
    let startDate = window.performance.now();
    let distance = mymod._mincost(0, memoryMatrix, memoryPath, 0);
    //let solverResult = mymod._SolveSudoku(arrPtr);
    let endDate = window.performance.now();
    let resultPath = getPath(mymod, memoryPath);
    // Ahora hay que reflejar los cambios en html
    //setSudokuGrid(resultMatrix);
    console.log(`La distancia minima es: ${distance} Excecution time: ${(endDate - startDate)} ms ${resultPath}`);
  // }
})

