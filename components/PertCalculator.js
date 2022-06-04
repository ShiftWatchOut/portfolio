import React, { useEffect, useReducer, useState } from 'react'

const theadList = ['任务', '乐观预估', '标称预估', '悲观预估', 'μ', 'σ']

const isPositive = (n) => {
  return typeof n === 'number' && n >= 0
}

const getMiu = (o, n, p) => {
  let res = 0
  try {
    for (const t of [o, n, p]) {
      if (!isPositive(t)) {
        throw new Error()
      }
    }
    res = (o + n * 4 + p) / 6
  } catch (_) {

  }
  return isPositive(res) ? res.toFixed(1) : 0
}
const getSigma = (o, _n, p) => {
  let res = 0
  try {
    for (const t of [o, p]) {
      if (!isPositive(t)) {
        throw new Error()
      }
    }
    res = (p - o) / 6
  } catch (_) {

  }
  return isPositive(res) ? res.toFixed(1) : 0
}

/**
 * 
 * @param {object} props
 * @param {number} props.value
 * @param {() => void} props.onChange
 * @param {'number'|'text'} props.type
 */
const HiddenInput = (props) => {
  const [editting, setEditting] = useState(false);
  const [innerValue, setInnerValue] = useState('');
  useEffect(() => {
    setInnerValue(props.value)
  }, [props.value])

  const handleFinish = () => {
    setEditting(false)
    if (!Object.is(innerValue, props.value) && typeof props.onChange === 'function') {
      let passedValue = innerValue
      if (props.type === 'number') {
        passedValue = parseInt(passedValue) || 0
      }
      setInnerValue(passedValue)
      props.onChange(passedValue)
    }
  }
  return (editting ?
    <input
      style={{
        display: 'inline-block',
        width: '100%'
      }}
      value={innerValue}
      type={props.type}
      onChange={(e) => {
        setInnerValue(e.target.value)
      }}
      onBlur={handleFinish}
      onKeyPress={(e) => { if (e.key === 'Enter') { handleFinish() } }}
      autoFocus
    /> :
    <div
      style={{
        display: 'inline-block',
        width: '100%'
      }}
      onClick={() => { setEditting(true) }}
    >{props.value}</div>)
}

const initialState = [['初始任务', 0, 0, 0]]

/**
 * @typedef {{row: number, col: number, value: number, type?: 'update'|'add'|'delete'}} ActionType
 * @param {[][]} state 
 * @param {ActionType} action 
 */
const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      const newArr = [...state]
      const targetRow = [...state[action.row]]
      targetRow[action.col] = action.value
      newArr[action.row] = targetRow
      return newArr
    default:
      throw new Error('未曾设想的 action type' + JSON.stringify(action));
  }
}

const PertCalculator = () => {
  /** @type {[[][], (action: ActionType) => void]} */
  const [tableData, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      <style jsx>{`
        .pert-table {
          text-align: center;
          table-layout: fixed;
        }
      `}</style>
      <table className='pert-table'>
        <caption><h3>Pert 计算器</h3></caption>
        <thead>
          <tr>
            {theadList.map((head) => <th key={head}>{head}</th>)}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIdx) => <tr key={rowIdx}>
            {row.map((col, colIdx) => <td key={`${rowIdx}-${colIdx}`}>
              <HiddenInput
                value={col}
                type={typeof col === 'number' ? 'number' : 'text'}
                onChange={(v) => dispatch({
                  type: 'update',
                  col: colIdx,
                  row: rowIdx,
                  value: v,
                })} />
            </td>)}
            <td>{getMiu(row[1], row[2], row[3])}</td>
            <td>{getSigma(row[1], row[2], row[3])}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default PertCalculator