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

const defaultRow = ['默认任务', 0, 0, 0]
const initialState = [[...defaultRow]]

/**
 * @typedef {{row: number, col: number, value: number, type?: 'update'|'add'|'delete'}} ActionType
 * @param {[][]} state 
 * @param {ActionType} action 
 */
const reducer = (state, action) => {
  const newArr = [...state]
  switch (action.type) {
    case 'update':
      const targetRow = [...state[action.row]]
      targetRow[action.col] = action.value
      newArr[action.row] = targetRow
      return newArr
    case 'add':
      newArr.push([...defaultRow])
      return newArr
    case 'delete':
      if (newArr.length > 1) {
        newArr.splice(-1)
      }
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
          word-break: keep-all;
          white-space: nowrap;
        }
        .pert-table tfoot tr {
          border-top: 1px solid gray;
        }
      `}</style>
      <table className='pert-table'>
        <caption><h3>PERT 计算器</h3></caption>
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
        <tfoot>
          <tr>
            <td><button onClick={() => { dispatch({ type: 'add' }) }}>➕新增一个</button></td>
            <td><button onClick={() => { dispatch({ type: 'delete' }) }}>⛔删除上个</button></td>
            <td>最少一个</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default PertCalculator