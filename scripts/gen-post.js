#!/usr/bin/env node

const fs = require('fs/promises')
const { log, error } = require('console')
const path = require('path')
const prompts = require('prompts')
const { reset, red, yellow } = require('kolorist')

const initialFilename = 'new-post.md'
const initial = {
    title: 'New Post',
    description: 'description text',
    tag: '',
    date: (new Date()).toLocaleDateString()
}
const postsFolder = path.join(__dirname, '..', 'pages', 'posts')
log(`今天: ${initial.date}， 又努力创作了呢！${yellow('☀ ☀ ☀ ☀ ☀ ☀')}`)
const run = async () => {
    let result = {}
    try {
        result = await prompts([
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
                initial: initialFilename
            },
            {
                name: 'description',
                type: 'text',
                message: reset('描述文字'),
                initial: initial.description
            },
            {
                name: 'tag',
                type: 'text',
                choices: [],
                message: reset('标签分类'),
                initial: initial.tag
            },
        ],
        {
            onCancel: () => { throw new Error(red('✖') + ' 已取消操作') }
        })
    } catch (err) {
        log(err.message)
        return
    }

    const templateFile = await fs.readFile(path.join(__dirname, './template/index.md'))
    let str = templateFile.toString('utf-8')
    const targetFilename = result.filename
    for (const key in initial) {
        if (Object.hasOwnProperty.call(initial, key)) {
            str = str.replace(/{{ (\w+) }}/g, (match, $1) => result[$1]||initial[$1])
        }
    }
    await fs.writeFile(path.join(postsFolder, targetFilename), str)
}

run().catch(err => {
    error(red('外部错误：'), err)
})