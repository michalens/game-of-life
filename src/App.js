import React, { useCallback, useRef, useState } from 'react';

import produce from 'immer'

const numRows = 50;
const numCols = 50;

const operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
]

const generateEmptyGrid = () => {
  const rows = []
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows
}

function App() {

  const [ grid, setGrid ] = useState(() => {
    return generateEmptyGrid()
  })

  const [ running, setRunning ] = useState(false)

  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for(let i = 0; i < numRows; i++) {
          for(let k = 0; k < numCols; k++) {
            let neighbours = 0
            operations.forEach(([x, y]) => {
              const newI = i + x
              const newK = k + y
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbours += g[newI][newK ]
              }
            })

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbours === 3) {
              gridCopy[i][k] = 1
            }
          }
        }
      })
    })

    setTimeout(runSimulation, 10)
  }, [])

  return (
    <>
    <button
      onClick={(() => {
        setRunning(!running)
        if (!running) {
          runningRef.current = true
          runSimulation()
        }
      })}
    >{running ? 'stop' : 'start'}</button>

    <button onClick={() => {
      setGrid(generateEmptyGrid())
    }}>clear</button>

    <button onClick={() => {
      const rows = []
      for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => Math.random() > 0.7 ? 1 : 0))
      }
      setGrid(rows)
    }}>
      random
    </button>
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${numCols}, 20px)`
    }}>
      {grid.map((row, i) => (
        row.map((col, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][j] = grid[i][j] ? 0 : 1
              })
              setGrid(newGrid)
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][j] ? "black" : undefined,
              border: "solid 1px black"
            }}
          >

          </div>
        ))
      ))}
    </div>
    </>
  );
}

export default App;
