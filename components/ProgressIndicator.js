import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '../utils'

const ProgressIndicator = () => {
  const router = useRouter()
  const showProgress = router.pathname.startsWith('/posts/');
  /** @type {import('react').RefObject<HTMLDivElement>} */
  const innerRef = useRef()
  useIsomorphicLayoutEffect(() => {
    /**
     * @param {Event} e
     */
    const scrollHandler = (e) => {
      const clientHeight = document.documentElement.clientHeight
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const progressELe = innerRef.current;
      if (progressELe) {
        progressELe.style.width = `${(scrollTop / (scrollHeight - clientHeight))/* .toFixed(2) */ * 100}%`
      }
    }
    document.addEventListener('scroll', scrollHandler)
    return () => {
      document.removeEventListener(
        'scroll',
        scrollHandler,
        true,
      )
    }
  }, [])

  return showProgress && (
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
          position: 'absolute',
          left: 0,
          width: '0%',
          height: '100%',
          backgroundColor: '#0089f2',
        }}
        ref={innerRef}
      />
    </div>
  )
}

export default ProgressIndicator
