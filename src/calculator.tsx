import React, { useState } from "react";

// Tipo para las matrices
type Matrix = number[][][] | number[][] | number[];

// Función para sumar matrices
const sumMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  if (Array.isArray(matrix1[0])) {
    if (Array.isArray((matrix1 as number[][])[0])) {
      // Para matrices tridimensionales
      return (matrix1 as number[][][]).map((plane, i) =>
        plane.map((row, j) =>
          row.map((value, k) => value + (matrix2 as number[][][])[i][j][k])
        )
      );
    }
    // Para matrices bidimensionales
    return (matrix1 as number[][]).map((row, i) =>
      row.map((value, j) => value + (matrix2 as number[][])[i][j])
    );
  }
  // Para matrices unidimensionales
  return (matrix1 as number[]).map((value, i) => value + (matrix2 as number[])[i]);
};

// Función para restar matrices
const subtractMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  if (Array.isArray(matrix1[0])) {
    if (Array.isArray((matrix1 as number[][])[0])) {
      // Para matrices tridimensionales
      return (matrix1 as number[][][]).map((plane, i) =>
        plane.map((row, j) =>
          row.map((value, k) => value - (matrix2 as number[][][])[i][j][k])
        )
      );
    }
    // Para matrices bidimensionales
    return (matrix1 as number[][]).map((row, i) =>
      row.map((value, j) => value - (matrix2 as number[][])[i][j])
    );
  }
  // Para matrices unidimensionales
  return (matrix1 as number[]).map((value, i) => value - (matrix2 as number[])[i]);
};

// Función para multiplicar matrices bidimensionales
const multiplyMatrices = (matrix1: number[][], matrix2: number[][]): number[][] => {
  const result: number[][] = Array(matrix1.length)
    .fill(0)
    .map(() => Array(matrix2[0].length).fill(0));

  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix2[0].length; j++) {
      for (let k = 0; k < matrix2.length; k++) {
        result[i][j] += matrix1[i][k] * matrix2[k][j];
      }
    }
  }

  return result;
};

// Componente principal
const MatrixCalculator: React.FC = () => {
  const [dimension, setDimension] = useState(1);
  const [matrix1, setMatrix1] = useState<Matrix>([]);
  const [matrix2, setMatrix2] = useState<Matrix>([]);
  const [resultMatrix, setResultMatrix] = useState<Matrix | null>(null);
  const [operation, setOperation] = useState<string>("sum");

  const handleDimensionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const dim = parseInt(event.target.value);
    setDimension(dim);
    setMatrix1(createEmptyMatrix(dim));
    setMatrix2(createEmptyMatrix(dim));
    setResultMatrix(null); // Resetear resultado
  };

  const createEmptyMatrix = (dim: number): Matrix => {
    if (dim === 1) return [0, 0, 0];
    if (dim === 2) return [[0, 0], [0, 0]];
    if (dim === 3) return [[[0, 0], [0, 0]], [[0, 0], [0, 0]]];
    return [];
  };

  const handleMatrixChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number,
    j?: number,
    k?: number,
    isMatrix1 = true
  ) => {
    const value = parseFloat(event.target.value);
    const newMatrix = isMatrix1 ? JSON.parse(JSON.stringify(matrix1)) : JSON.parse(JSON.stringify(matrix2));

    if (dimension === 1) {
      (newMatrix as number[])[i] = value;
    } else if (dimension === 2 && j !== undefined) {
      (newMatrix as number[][])[i][j] = value;
    } else if (dimension === 3 && j !== undefined && k !== undefined) {
      (newMatrix as number[][][])[i][j][k] = value;
    }

    if (isMatrix1) setMatrix1(newMatrix);
    else setMatrix2(newMatrix);
  };

  const handleOperationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOperation(event.target.value);
  };

  const handleCalculate = () => {
    let result: Matrix | null = null;

    if (operation === "sum") {
      result = sumMatrices(matrix1, matrix2);  // Llamada a la función de suma
    } else if (operation === "subtract") {
      result = subtractMatrices(matrix1, matrix2);  // Llamada a la función de resta
    } else if (operation === "multiply") {
      result = multiplyMatrices(matrix1 as number[][], matrix2 as number[][]);  // Llamada a la función de multiplicación
    }

    setResultMatrix(result);  // Actualizar el resultado
  };

  return (
    <div>
      <h1>Calculadora de Matrices</h1>

      <label htmlFor="dimension">Dimensión:</label>
      <select id="dimension" value={dimension} onChange={handleDimensionChange}>
        <option value={1}>Unidimensional</option>
        <option value={2}>Bidimensional</option>
        <option value={3}>Tridimensional</option>
      </select>

      <label htmlFor="operation">Operación:</label>
      <select id="operation" value={operation} onChange={handleOperationChange}>
        <option value="sum">Suma</option>
        <option value="subtract">Resta</option>
        {dimension === 2 && <option value="multiply">Multiplicación</option>}
      </select>

      {/* Input para la primera matriz */}
      <h3>Matriz 1</h3>
      {dimension === 1 && (matrix1 as number[]).map((value, i) => (
        <input
          key={i}
          type="number"
          value={value}
          onChange={(e) => handleMatrixChange(e, i, undefined, undefined, true)}
        />
      ))}
      {dimension === 2 && (matrix1 as number[][]).map((row, i) => (
        <div key={i}>
          {row.map((value, j) => (
            <input
              key={j}
              type="number"
              value={value}
              onChange={(e) => handleMatrixChange(e, i, j, undefined, true)}
            />
          ))}
        </div>
      ))}
      {dimension === 3 && (matrix1 as number[][][]).map((plane, i) => (
        <div key={i}>
          {plane.map((row, j) => (
            <div key={j}>
              {row.map((value, k) => (
                <input
                  key={k}
                  type="number"
                  value={value}
                  onChange={(e) => handleMatrixChange(e, i, j, k, true)}
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      {/* Input para la segunda matriz */}
      <h3>Matriz 2</h3>
      {dimension === 1 && (matrix2 as number[]).map((value, i) => (
        <input
          key={i}
          type="number"
          value={value}
          onChange={(e) => handleMatrixChange(e, i, undefined, undefined, false)}
        />
      ))}
      {dimension === 2 && (matrix2 as number[][]).map((row, i) => (
        <div key={i}>
          {row.map((value, j) => (
            <input
              key={j}
              type="number"
              value={value}
              onChange={(e) => handleMatrixChange(e, i, j, undefined, false)}
            />
          ))}
        </div>
      ))}
      {dimension === 3 && (matrix2 as number[][][]).map((plane, i) => (
        <div key={i}>
          {plane.map((row, j) => (
            <div key={j}>
              {row.map((value, k) => (
                <input
                  key={k}
                  type="number"
                  value={value}
                  onChange={(e) => handleMatrixChange(e, i, j, k, false)}
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleCalculate}>Calcular</button>

      {/* Mostrar el resultado */}
      {resultMatrix && (
        <div>
          <h3>Resultado</h3>
          {Array.isArray(resultMatrix[0]) ? (
            Array.isArray((resultMatrix as number[][])[0]) ? (
              (resultMatrix as number[][][]).map((plane, i) => (
                <div key={i}>
                  {plane.map((row, j) => (
                    <div key={j}>
                      {row.map((value, k) => (
                        <span key={k}>{value} </span>
                      ))}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              (resultMatrix as number[][]).map((row, i) => (
                <div key={i}>
                  {row.map((value, j) => (
                    <span key={j}>{value} </span>
                  ))}
                </div>
              ))
            )
          ) : (
            (resultMatrix as number[]).map((value, i) => (
              <span key={i}>{value} </span>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MatrixCalculator;
