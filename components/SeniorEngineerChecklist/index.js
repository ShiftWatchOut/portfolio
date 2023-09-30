import React from 'react'
import { useState, useEffect } from 'react'
import checklistJson from './senior-engineer-checklist.json'

const TABLE_MODE = 0
const LIST_MODE = 1
const SIMPLE_LIST_MODE = 2
const LEVELS = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
}
const categories = [...new Set(checklistJson.map((item) => item.category))]

const modes = [
  { value: TABLE_MODE, label: '表格(可供下载)' },
  { value: LIST_MODE, label: '列表' },
  { value: SIMPLE_LIST_MODE, label: '简单列表 ' },
]

const Index = () => {
  const [currentMode, setCurrentMode] = useState(TABLE_MODE)
  const [tableFilter, setTableFilter] = useState({
    task: '',
    effort: '',
    category: '',
    careerImpact: '',
    companyImpact: '',
    reverse: false,
  })
  const setFilter = (key, value) => {
    setTableFilter({
      ...tableFilter,
      [key]: value,
    })
  }
  useEffect(() => {
    return () => {}
  }, [])

  return (
    <div>
      <style jsx>{`
        .mode-changer .start,
        .mode-changer .option {
          margin-right: 20px;
        }
      `}</style>
      <section className="mode-changer">
        <span className="start">查看方式：</span>
        {modes.map((mode) => (
          <span className="option" key={mode.label}>
            <input
              type="radio"
              id={mode.label}
              name={mode.label}
              onChange={(e) => {
                if (e.target.value) {
                  setCurrentMode(mode.value)
                }
              }}
              checked={currentMode === mode.value}
            />
            <label htmlFor={mode.label}>{mode.label}</label>
          </span>
        ))}
      </section>
      <section className="main-content">
        {
          currentMode === TABLE_MODE ? (
            /* 表格 */ <table>
              <thead>
                <tr role="row">
                  <th rowSpan="1" colSpan="1">
                    #
                  </th>
                  <th rowSpan="1" colSpan="1">
                    任务
                  </th>
                  <th colSpan="1" rowSpan="1">
                    投入
                  </th>
                  <th colSpan="1" rowSpan="1">
                    类型
                  </th>
                  <th colSpan="2" rowSpan="1">
                    影响
                  </th>
                </tr>
                <tr role="row">
                  <th
                    rowSpan="1"
                    colSpan="1"
                    onClick={() => {
                      checklistJson.reverse()
                      setFilter('reverse', !tableFilter.reverse)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {tableFilter.reverse ? '↑' : '↓'}
                  </th>
                  <th rowSpan="1" colSpan="1">
                    <input
                      style={{ fontSize: 'small', width: '100%' }}
                      type="text"
                      placeholder="搜索任务"
                      value={tableFilter.task}
                      onChange={(e) => {
                        setFilter('task', e.target.value)
                      }}
                    />
                  </th>
                  <th rowSpan="1" colSpan="1">
                    <select
                      style={{ fontSize: 'small' }}
                      value={tableFilter.effort}
                      onChange={(e) => {
                        setFilter('effort', e.target.value)
                      }}
                    >
                      <option value=""></option>
                      {Object.entries(LEVELS).map(([key, level]) => (
                        <option value={level} key={key}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th rowSpan="1" colSpan="1">
                    <select
                      style={{ fontSize: 'small' }}
                      value={tableFilter.category}
                      onChange={(e) => {
                        setFilter('category', e.target.value)
                      }}
                    >
                      <option value=""></option>
                      {categories.map((category) => (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th rowSpan="1" colSpan="1">
                    <select
                      style={{ fontSize: 'small' }}
                      value={tableFilter.careerImpact}
                      onChange={(e) => {
                        setFilter('careerImpact', e.target.value)
                      }}
                    >
                      <option value="">职业</option>
                      {Object.entries(LEVELS).map(([key, level]) => (
                        <option value={level} key={key}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th rowSpan="1" colSpan="1">
                    <select
                      style={{ fontSize: 'small' }}
                      value={tableFilter.companyImpact}
                      onChange={(e) => {
                        setFilter('companyImpact', e.target.value)
                      }}
                    >
                      <option value="">公司</option>
                      {Object.entries(LEVELS).map(([key, level]) => (
                        <option value={level} key={key}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>
                {checklistJson.map((item, idx) => {
                  let meet = true
                  const {
                    task,
                    effort,
                    category,
                    careerImpact,
                    companyImpact,
                  } = tableFilter
                  if (task) meet = item.task.includes(task)
                  if (effort && meet) meet = item.effort === effort
                  if (category && meet) meet = item.category === category
                  if (careerImpact && meet)
                    meet = item.caimpact === careerImpact
                  if (companyImpact && meet)
                    meet = item.coimpact === companyImpact
                  return meet ? (
                    <tr role="row" key={item.task}>
                      <td style={{ textAlign: 'center' }}>
                        {tableFilter.reverse ? 60 - idx : idx + 1}
                      </td>
                      <td>{item.task}</td>
                      <td style={{ textAlign: 'center' }}>{item.effort}</td>
                      <td style={{ textAlign: 'center' }}>{item.category}</td>
                      <td style={{ textAlign: 'center' }}>{item.caimpact}</td>
                      <td style={{ textAlign: 'center' }}>{item.coimpact}</td>
                    </tr>
                  ) : null
                })}
              </tbody>
            </table>
          ) : (
            /* 列表 */
            <ol>
              {checklistJson.map((item) => (
                <li key={item.task}>
                  <span className="task">{item.task}</span>
                  {currentMode === LIST_MODE && (
                    <ul>
                      <li>
                        <span className="desc">投入：</span>
                        {item.effort}
                      </li>
                      <li>
                        <span className="desc">职业影响：</span>
                        {item.caimpact}
                      </li>
                      <li>
                        <span className="desc">公司影响：</span>
                        {item.coimpact}
                      </li>
                      <li>
                        <span className="desc">类型：</span>
                        {item.category}
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          )
          /* 简单列表 */
        }
      </section>
    </div>
  )
}

export default class extends React.Component {
  state = {
    error: '',
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(err, errInfo) {
    console.log('error: ', err)
    console.log('info: ', errInfo)
    console.log('=======')
  }
  render() {
    const { error } = this.state
    return <>{error ? <span>组件错误！</span> : <Index />}</>
  }
}
