import React, { useEffect, useRef } from 'react'
import { isBrowser, useIsomorphicLayoutEffect } from '../utils';
import { startAnimation } from './tools/animations';

function MagicBackground() {
  /** @type {React.RefObject<HTMLCanvasElement>} */
  const canvasRef = useRef(null);
  useIsomorphicLayoutEffect(() => {
    const canvasEle = canvasRef.current;
    let cb;
    if (canvasEle && isBrowser()) {
      canvasEle.width = window.innerWidth;
      canvasEle.height = window.innerHeight;
      const ctx = canvasEle.getContext('2d');
      cb = startAnimation(ctx, window.innerWidth, window.innerHeight)
    }
    return cb
  }, [])
  
  return (
    <>
      <style jsx>{`
        #background-canvas {
          z-index: -1;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height:100%;
        }
      `}</style>
      <canvas id="background-canvas" ref={canvasRef}>
        Your browser does not support canvas
      </canvas>
    </>
  )
}

export default MagicBackground