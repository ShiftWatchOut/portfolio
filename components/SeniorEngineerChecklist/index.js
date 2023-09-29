import React from 'react'
import { useState, useEffect } from 'react'
import checklistJson from './senior-engineer-checklist.json'

const modes = [
  { value: 0, label: '表格(可供下载)' },
  { value: 1, label: '列表' },
  { value: 2, label: '简单列表 ' },
]

const Index = () => {
  const [currentMode, setCurrentMode] = useState(0)
  useEffect(() => {
    // console.log('list json', checklistJson)
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
    </div>
  )
}

export default Index
