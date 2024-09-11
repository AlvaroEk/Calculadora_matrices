import React, { useState } from "react";

// Tipo para matrices de diferentes dimensiones
type Matrix = number[][][] | number[][] | number[];

// Verifica si un valor es un array de arrays
const is2DArray = (value: any): value is number[][] => Array.isArray(value) && Array.isArray(value[0]);

// Verifica si un valor es un array de arrays de arrays
const is3DArray = (value: any): value is number[][][] => Array.isArray(value) && Array.isArray(value[0]) && Array.isArray(value[0][0]);

// Función para sumar matrices
const sumMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  console.log("Sumando matrices...");
  if (is3DArray(matrix1)) {
    return matrix1.map((plane, i) =>
      plane.map((row, j) =>
        row.map((value, k) => value + (matrix2 as number[][][])[i][j][k])
      )
    );
  } else if (is2DArray(matrix1)) {
    return matrix1.map((row, i) =>
      row.map((value, j) => value + (matrix2 as number[][])[i][j])
    );
  } else {
    return (matrix1 as number[]).map((value, i) => value + (matrix2 as number[])[i]);
  }
};

// Función para restar matrices
const subtractMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  console.log("Restando matrices...");
  if (is3DArray(matrix1)) {
    return matrix1.map((plane, i) =>
      plane.map((row, j) =>
        row.map((value, k) => value - (matrix2 as number[][][])[i][j][k])
      )
    );
  } else if (is2DArray(matrix1)) {
    return matrix1.map((row, i) =>
      row.map((value, j) => value - (matrix2 as number[][])[i][j])
    );
  } else {
    return (matrix1 as number[]).map((value, i) => value - (matrix2 as number[])[i]);
  }
};

// Función para multiplicar vectores (unidimensionales)
const multiplyVectors = (vector1: number[], vector2: number[]): number[] => {
  console.log("Multiplicando vectores...");
  if (vector1.length !== vector2.length) {
    throw new Error("Los vectores deben tener la misma longitud.");
  }
  return vector1.map((value, i) => value * vector2[i]);
};

// Función para multiplicar matrices bidimensionales
const multiplyMatrices = (matrix1: number[][], matrix2: number[][]): number[][] => {
  console.log("Multiplicando matrices bidimensionales...");
  if (matrix1[0].length !== matrix2.length) {
    throw new Error("Dimensiones incompatibles para la multiplicación bidimensional.");
  }

  const result: number[][] = Array.from({ length: matrix1.length }, () =>
    Array(matrix2[0].length).fill(0)
  );

  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix2[0].length; j++) {
      for (let k = 0; k < matrix2.length; k++) {
        result[i][j] += matrix1[i][k] * matrix2[k][j];
      }
    }
  }

  return result;
};

// Función para multiplicar matrices tridimensionales
const multiply3DMatrices = (matrix1: number[][][], matrix2: number[][][]): number[][][] => {
  console.log("Multiplicando matrices tridimensionales...");

  // Imprimir dimensiones de las matrices para depuración
  console.log("Dimensiones de matrix1:", matrix1.length, matrix1[0].length, matrix1[0][0].length);
  console.log("Dimensiones de matrix2:", matrix2.length, matrix2[0].length, matrix2[0][0].length);

  if (matrix1[0][0].length !== matrix2.length) {
    throw new Error("Dimensiones incompatibles para la multiplicación tridimensional.");
  }

  const result: number[][][] = Array.from({ length: matrix1.length }, () =>
    Array.from({ length: matrix1[0].length }, () =>
      Array(matrix2[0][0].length).fill(0)
    )
  );

  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix1[0].length; j++) {
      for (let k = 0; k < matrix2[0][0].length; k++) {
        for (let l = 0; l < matrix2.length; l++) {
          result[i][j][k] += matrix1[i][j][l] * matrix2[l][j][k];
        }
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
    if (dim === 3) return [[[0, 0, 0]], [[0, 0, 0]], [[0, 0, 0]]];
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
    console.log("Operación seleccionada:", operation);
    console.log("Matrix1:", matrix1);
    console.log("Matrix2:", matrix2);

    let result: Matrix | null = null;

    try {
      if (operation === "sum") {
        result = sumMatrices(matrix1, matrix2);  // Llamada a la función de suma
      } else if (operation === "subtract") {
        result = subtractMatrices(matrix1, matrix2);  // Llamada a la función de resta
      } else if (operation === "multiply") {
        if (dimension === 1) {
          // Para matrices unidimensionales (vectores)
          result = [multiplyVectors(matrix1 as number[], matrix2 as number[])]; // El resultado es un número (escalar) convertido a array
        } else if (dimension === 2) {
          // Para matrices bidimensionales
          result = multiplyMatrices(matrix1 as number[][], matrix2 as number[][]);
        } else if (dimension === 3) {
          // Para matrices tridimensionales
          result = multiply3DMatrices(matrix1 as number[][][], matrix2 as number[][][]);
        }
      }
    } catch (error) {
      console.error("Error en la operación:", error);
    }

    console.log("Resultado:", result);
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
        <option value="multiply">Multiplicación</option>
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
          <h3>Resultado:</h3>
          {dimension === 1 && (resultMatrix as number[]).map((value, i) => <div key={i}>{value}</div>)}
          {dimension === 2 && (resultMatrix as number[][]).map((row, i) => (
            <div key={i}>
              {row.map((value, j) => (
                <span key={j}>{value} </span>
              ))}
            </div>
          ))}
          {dimension === 3 && (resultMatrix as number[][][]).map((plane, i) => (
            <div key={i}>
              {plane.map((row, j) => (
                <div key={j}>
                  {row.map((value, k) => (
                    <span key={k}>{value} </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatrixCalculator;
