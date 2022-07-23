import { animated, useSpring, useSpringRef } from '@react-spring/web'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/lmbtfy.module.scss'
import { copy, sleep } from '../../utils'

const infos = {
  withQ: [
    '让我来教你正确的打开方式',
    '1、找到输入框并选中',
    '2、输入你要找的内容',
    '3、点击下“百度一下”按钮',
    '怎么样，学会了吗？',
  ],
  withOutQ: [
    '输入一个问题，然后点击百度一下',
    '↓↓↓ 复制下面的链接，教伸手党使用百度',
  ],
}

const offset = 10

const PERSISTENCE = {
  animating: false,
}

const Lmbtfy = () => {
  const [searchValue, setSearchValue] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const qRef = useRef('')
  /** @type {import('react').RefObject<HTMLInputElement>} */
  const inputRef = useRef(null)
  /** @type {import('react').RefObject<HTMLButtonElement>} */
  const buttonRef = useRef(null)
  /** @type {import('react').RefObject<HTMLImageElement>} */
  const aniImageRef = useRef(null)
  const springRef = useSpringRef()
  const style = useSpring({
    loop: true,
    to: async (next, cancel) => {
      await sleep()
      if (PERSISTENCE.animating) {
        setStatePhase(1)
      } else {
        return
      }
      const imageCurrent = aniImageRef.current
      const inputCurrent = inputRef.current
      const buttonCurrent = buttonRef.current
      const inputPos = inputCurrent?.getBoundingClientRect()
      await next({ x: inputPos.x + offset, y: inputPos.y + offset })
      imageCurrent.classList.add(styles.clicking)
      inputCurrent?.focus()
      if (PERSISTENCE.animating) {
        setStatePhase(2)
        setSearchValue(qRef.current)
      } else {
        return
      }
      await sleep()
      imageCurrent.classList.remove(styles.clicking)
      const buttonPos = buttonCurrent?.getBoundingClientRect()
      if (PERSISTENCE.animating) {
        setStatePhase(3)
      } else {
        return
      }
      await next({ x: buttonPos.x + offset, y: buttonPos.y + offset })
      imageCurrent.classList.add(styles.clicking)
      await sleep()
      imageCurrent.classList.remove(styles.clicking)
      window.location.replace(
        `https://www.baidu.com/s?ie=utf-8&wd=${qRef.current}`,
      )
    },
    from: {
      x: 0,
      y: 0,
    },
    ref: springRef,
    delay: 1000,
  })
  const [statePhase, setStatePhase] = useState(0)
  const [copyBoardVisible, setCopyBoardVisible] = useState(false)
  const router = useRouter()
  const q = router.query.q
  // 有参数时默认进来要开始动画
  const withQ = !!q
  const [animating, setAnimating] = useState(withQ)
  const infoText = animating
    ? infos.withQ[statePhase]
    : infos.withOutQ[statePhase]
  useEffect(() => {
    if (q) {
      qRef.current = q
      springRef.start()
      PERSISTENCE.animating = true
      setAnimating(true)
    }
  }, [q])

  useEffect(() => {
    return () => {
      springRef.stop()
      setSearchValue('')
    }
  }, [])

  const handleCopy = () => {
    copy(previewUrl)
  }

  const handlePreview = () => {
    window.open(previewUrl)
  }

  return (
    <div>
      <Head>
        <title>让我帮你百度一下</title>
        <link rel="icon" href="/images/baidu.ico" />
      </Head>
      <style jsx global>{`
        body {
          padding: 0px;
        }
      `}</style>
      <section className={styles.content}>
        <animated.div
          ref={aniImageRef}
          className={styles.animated_arrow}
          style={animating ? style : { display: 'none' }}
        >
          <img src="/images/arrow.png" />
        </animated.div>
        <div className={styles.logo}>
          <span>让我帮你</span>
          &nbsp; &nbsp;
          <Image
            className={styles.baidu}
            src="/images/baidu_logo_pc.png"
            width={202}
            height={66}
          />
          &nbsp; &nbsp;
          <span>一下</span>
        </div>
        <form
          id={styles.search_form}
          onSubmit={(e) => {
            e.preventDefault()
            setStatePhase(1)
            setPreviewUrl(
              `${location.origin}${location.pathname}?q=${searchValue}`,
            )
            setCopyBoardVisible(true)
            console.log('searchValue', searchValue)
          }}
        >
          <div className={styles.search_form_group}>
            <div className={styles.search_form_input}>
              <input
                ref={inputRef}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
                type={'search'}
                id="kw"
                autoComplete="off"
                maxLength={255}
                required
              />
            </div>
            <button ref={buttonRef} id={styles.search_submit}>
              百度一下
            </button>
          </div>
        </form>
        <div className={styles.info}>
          {infoText}
          {copyBoardVisible && (
            <div className={styles.copy_board}>
              <textarea value={previewUrl} readOnly></textarea>
              <div className={styles.buttons}>
                <button onClick={handleCopy}>复 制</button>
                <button onClick={handlePreview}>预 览</button>
              </div>
            </div>
          )}
        </div>
        {animating && (
          <button
            onClick={() => {
              springRef.update({ opacity: 0 })
              springRef.stop()
              PERSISTENCE.animating = false
              setSearchValue('')
              setAnimating(false)
              setStatePhase(0)
            }}
          >
            快停火，我是友军
          </button>
        )}
        <footer className={styles.warning}>
          * 本站与百度公司没有任何联系，baidu 以及本站出现的百度公司 Logo
          是百度公司的商标
        </footer>
      </section>
    </div>
  )
}

export default Lmbtfy
