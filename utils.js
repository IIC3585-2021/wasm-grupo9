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

const resetSudokuGrid = () => {
  $('.form-control').each(function(i, obj) {
    $(obj).val("");
  })
}

// const makePtrOfArray = (myModule) => {
//   let sudokuMatrix = getSudokuGrid();
//   const arrayPtr = myModule._calloc(N, 4);
//   for (let i = 0; i < N; i++) {
//     let rowsPtr = myModule._calloc(N, 4);
//     myModule.setValue(arrayPtr + i * 4, rowsPtr, "i32");
//     for (let j = 0; j < N; j++) {
//       myModule.setValue(rowsPtr + j * 4, sudokuMatrix[i][j], "i32");
//     }
//   }
//   return arrayPtr;
// }


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

// const getArrayFromPtr = (myModule, ptr) => {
//   let resultMatrix = matrix(9, 9);
//   for (let i = 0; i < N; i++) {
//     let rowsPtr = myModule.getValue(ptr + i * 4, "i32");
//     for (let j = 0; j < N; j++) {
//       resultMatrix[i][j] =  myModule.getValue(rowsPtr + j * 4, "i32");
//     }
//   }
//   return resultMatrix;
// }


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

