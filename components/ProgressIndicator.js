import React, { useEffect, useRef } from 'react'

const ProgressIndicator = () => {
  /** @type {import('react').RefObject<HTMLDivElement>} */
  const innerRef = useRef()
  useEffect(() => {
    /**
     * @param {Event} e
     */
    const scrollHandler = (e) => {
      const clientHeight = document.body.clientHeight
      const scrollTop = document.body.scrollTop
      const scrollHeight = document.body.scrollHeight
      console.table({ clientHeight, scrollTop, scrollHeight, e })
    }
    console.log('binding')
    // window.onscroll = scrollHandler
    document.documentElement.addEventListener('scroll', scrollHandler, true)
    return () => {
      // window.onscroll = null
      document.documentElement.removeEventListener(
        'scroll',
        scrollHandler,
        true,
      )
    }
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: 3,
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#DDD',
      }}
    >
      <div
        style={{
          content: '',
          position: 'absolute',
          left: 0,
          width: '30%',
          height: '100%',
          backgroundColor: '#0089f2',
        }}
        ref={innerRef}
      />
    </div>
  )
}

export default ProgressIndicator
