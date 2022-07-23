#!/usr/bin/env node

const fs = require('fs/promises')
const { log, error } = require('console')
const path = require('path')
const prompts = require('prompts')
const { reset, red, yellow } = require('kolorist')
const { execSync } = require('child_process')

String.prototype.replaceAll = function (targetStr, newStr) {
  let sourceStr = this.valueOf()
  while (sourceStr.indexOf(targetStr) !== -1) {
    sourceStr = sourceStr.replace(targetStr, newStr)
  }
  return sourceStr
}

const initialFilename = 'new-post.md'
const initial = {
  title: 'New Post',
  description: 'description text',
  tag: '',
  date: new Date().toLocaleDateString(),
}
const postsFolder = path.join(__dirname, '..', 'pages', 'posts')
log(`今天是 ${initial.date}，又努力创作了呢！${yellow('☀ ☀ ☀ ☀ ☀ ☀')}`)
const run = async () => {
  let result = {}
  const tagList = await getPostsTags()
  try {
    result = await prompts(
      [
        {
          name: 'title',
          type: 'text',
          message: reset('博文标题'),
          initial: initial.title,
        },
        {
          name: 'filename',
          type: 'text',
          message: reset('MD 文件名'),
          initial: initialFilename,
        },
        {
          name: 'description',
          type: 'text',
          message: reset('描述文字'),
          initial: initial.description,
        },
        {
          name: 'tag',
          type: 'multiselect',
          choices: tagList.map((v) => ({ value: v, title: v })),
          message: reset('标签分类'),
          initial: initial.tag,
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' 已取消操作')
        },
      },
    )
  } catch (err) {
    log(err.message)
    return
  }

  const templateFile = await fs.readFile(
    path.join(__dirname, './template/index.md'),
  )
  let str = templateFile.toString('utf-8')
  const targetFilename = result.filename
  if (Array.isArray(result.tag)) {
    result.tag = result.tag.join(', ')
  }
  for (const key in initial) {
    if (Object.hasOwnProperty.call(initial, key)) {
      str = str.replace(
        /{{ (\w+) }}/g,
        (_match, $1) => result[$1] || initial[$1],
      )
    }
  }
  await fs.writeFile(path.join(postsFolder, targetFilename), str)
  execSync(`code ${path.join(postsFolder, targetFilename)}`)
}

const getPostsTags = async () => {
  const arr = []
  const standardTag = 'tag:'
  for (const file of await fs.readdir(postsFolder)) {
    const content = (await fs.readFile(path.join(postsFolder, file))).toString()
    // 匹配 --- --- 内的信息，并分割成数组
    const meta = content
      .match(/-{3}(?<meta>[\S\s]+)-{3}/)
      .groups.meta?.replaceAll('\r', '')
      .replaceAll(',', '')
      .split('\n')
    /** @type {string[]} 拿到文件内所有 tag */
    const tags = meta
      .find((m) => m.startsWith(standardTag))
      ?.split(' ')
      .filter((v) => v !== standardTag)
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (tag && !arr.includes(tag)) {
          arr.push(tag)
        }
      }
    }
  }
  return arr
}

run().catch((err) => {
  error(red('外部错误：'), err)
})
