#!/usr/bin/env node

const figlet = require('figlet')
const inquirer = require('inquirer')
const fs = require('fs/promises')
const fuzzy = require('fuzzy')
const chalk = require('chalk')
const { dir, log } = require('console')
const CheckboxPlusPrompt = require('./inpuire-plugin')
log(figlet.textSync('Welcome', {
    font: 'Doom',
    horizontalLayout: 'fitted',
    whitespaceBreak: true,
}));
var colors = [
    { name: 'The red color', value: 'red', short: 'red', disabled: false },
    { name: 'The blue color', value: 'blue', short: 'blue', disabled: true },
    { name: 'The green color', value: 'green', short: 'green', disabled: false },
    { name: 'The yellow color', value: 'yellow', short: 'yellow', disabled: false },
    { name: 'The black color', value: { name: 'black' }, short: 'black', disabled: false }
];
log(chalk.blue('hello'));
inquirer.registerPrompt('checkbox-plus', CheckboxPlusPrompt)
const run = async () => {
    try {
        const options = await inquirer.prompt([{
            name: 'title',
            type: 'input',
            message: '博客标题：',
            default: '新博客'
        }, {
            name: 'filename',
            type: 'input',
            message: '文件名：',
            default: 'new-post'
        }, {
            name: 'tag',
            type: 'input',
            message: '设置一个标签：',
            default: 'new-post'
        }, {
            name: 'tags',
            type: 'checkbox-plus',
            message: '输入标签：',
            default: ['yellow', 'red', { name: 'black' }],
            validate: function (answer) {

                if (answer.length == 0) {
                    return 'You must choose at least one color.';
                }

                return true;

            },
            source: function (answersSoFar, input) {

                input = input || '';

                return new Promise(function (resolve) {

                    var fuzzyResult = fuzzy.filter(input, colors, {
                        extract: function (item) {
                            return item['name'];
                        }
                    });

                    var data = fuzzyResult.map(function (element) {
                        return element.original;
                    });

                    resolve(data);

                }).catch((err) => {
                        console.warn('err:::::::', err);
                    }
                );

            }
        }])
        dir(options)
    } catch (error) {
        log(chalk.redBright("Something error。。。"))
        log(error)
    }
}

run()
