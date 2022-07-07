import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import styles from "../../styles/lmbtfy.module.scss"

const infos = {
  withQ: [
    '让我来教你正确的打开方式',
    '1、找到输入框并选中',
    '2、输入你要找的内容',
    '3、点击下“百度一下”按钮',
    '怎么样，学会了吗？'
  ],
  withOutQ: [
    '输入一个问题，然后点击百度一下',
    '↓↓↓ 复制下面的链接，教伸手党使用百度'
  ]
}

const Lmbtfy = () => {
  const [searchValue, setSearchValue] = useState("")
  const url = useRef("")
  const [statePhase, setStatePhase] = useState(0)
  const [copyBoardVisible, setCopyBoardVisible] = useState(false)
  const nextPhase = () => setStatePhase((c) => c + 1)
  const router = useRouter()
  const q = router.query.q
  // 有参数时默认进来要开始动画
  const [animating, setAnimating] = useState(!!q)
  const infoText = q ? infos.withQ[statePhase] : infos.withOutQ[statePhase]
  useEffect(() => {
    return () => {
      setSearchValue("")
    }
  }, [])

  const handleCopy = () => {
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (["granted", "prompt"].includes(result.state)) {
        navigator.clipboard.writeText(url.current).then(() => {
          alert('复制成功')
        }).catch((e) => {
          alert(`错误：${JSON.stringify(e)}`)
        })
      }
    })
  }

  const handlePreview = () => {
    window.open(url.current)
  }

  return (
    <div>
      <Head>
        <title>让我帮你百度一下</title>
        <link rel='icon' href='/images/baidu.ico' />
      </Head>
      <style jsx global>{`
        body {
          padding: 0px;
        }
      `}</style>
      <section className={styles.content}>
        <div className={styles.logo}>
          <span>让我帮你</span>
          &nbsp;
          &nbsp;
          <Image className={styles.baidu} src='/images/baidu_logo_pc.png' width={202} height={66} />
          &nbsp;
          &nbsp;
          <span>一下</span>
        </div>
        <form
          id={styles.search_form}
          onSubmit={(e) => {
            e.preventDefault()
            nextPhase()
            url.current = `${location.origin}${location.pathname}?q=${searchValue}`
            setCopyBoardVisible(true)
            console.log('searchValue', searchValue);
          }}
        >
          <div className={styles.search_form_group}>
            <div className={styles.search_form_input}>
              <input
                value={searchValue} onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
                type={"search"}
                id="kw"
                autoComplete='off'
                maxLength={255}
                required
              />
            </div>
            <button id={styles.search_submit}>百度一下</button>
          </div>
        </form>
        <div className={styles.info} >
          {infoText}
          {
            copyBoardVisible && searchValue && <div className={styles.copy_board}>
              <textarea value={url.current} readOnly></textarea>
              <div className={styles.buttons} >
                <button onClick={handleCopy}>复 制</button>
                <button onClick={handlePreview}>预 览</button>
              </div>
            </div>
          }
        </div>
        <footer className={styles.warning} >
          * 本站与百度公司没有任何联系，baidu 以及本站出现的百度公司 Logo 是百度公司的商标
        </footer>
      </section>
    </div>
  )
}

export default Lmbtfy