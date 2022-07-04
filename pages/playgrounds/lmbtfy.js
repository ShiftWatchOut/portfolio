import Head from 'next/head'
import Image from 'next/image'
import styles from "/styles/lmbtfy.module.scss"

const Lmbtfy = () => {
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
          <Image src='/images/baidu_logo_pc.png' width={202} height={66} />
          <span>一下</span>
        </div>
        <form id={styles.search_form}>
          <div className={styles.search_form_group}>
            <div className={styles.search_form_input}>
              <input type={"search"} id="kw" maxLength={255} required />
            </div>
            <button id={styles.search_submit}>百度一下</button>
          </div>
        </form>
        <div className={styles.info} >

        </div>
        <footer className={styles.warning} >
          * 本站与百度公司没有任何联系，baidu 以及本站出现的百度公司 Logo 是百度公司的商标
        </footer>
      </section>
    </div>
  )
}

export default Lmbtfy