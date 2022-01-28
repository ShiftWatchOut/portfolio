/**
 * Checkbox Plus
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

const chalk = require('chalk');
const cliCursor = require('cli-cursor');
const figures = require('figures');
const Base = require('inquirer/lib/prompts/base');
const Choices = require('inquirer/lib/objects/choices');
const observe = require('inquirer/lib/utils/events');
const Paginator = require('inquirer/lib/utils/paginator');

/**
 * 
 * @param {string} str
 */
const isString = str => {
    if (str != null && typeof str.valueOf() === 'string') {
        return true
    }
    return false
}
const isObject = (obj) => typeof obj === 'object' && obj != null

const isEqual = (val1, val2) => {
    if (!isObject(val1) || !isObject(val2)) {
        return val1 === val2
    }
    if (val1 === val2) {
        return true
    }
    const val1KeysLen = Object.keys(val1).length
    const val2KeysLen = Object.keys(val2).length
    if (val1KeysLen !== val2KeysLen) {
        return false
    }
    for (const key in val1) {
        if (Object.hasOwnProperty.call(val1, key)) {
            const eq = isEqual(val1[key], val2[key]);
            if (!eq) {
                return false
            }
        }
    }
    return true
}


/**
 * CheckboxPlusPrompt
 */
class CheckboxPlusPrompt extends Base {

    /**
     * Initialize the prompt
     * 
     * @param  {Object} questions
     * @param  {import('readline').Interface} rl
     * @param  {import('inquirer').Answers} answers
     */
    constructor(questions, rl, answers) {

        super(questions, rl, answers);

        // Default value for the highlight option
        if (typeof this.opt.highlight == 'undefined') {
            this.opt.highlight = false;
        }

        // Default value for the searchable option
        if (typeof this.opt.searchable == 'undefined') {
            this.opt.searchable = false;
        }

        // Default value for the default option
        if (typeof this.opt.default == 'undefined') {
            this.opt.default = null;
        }

        // Doesn't have source option
        if (!this.opt.source) {
            console.warn('source undefined');
            this.throwParamError('source');
        }

        // Init
        this.pointer = 0;
        this.firstSourceLoading = true;
        this.choices = new Choices([], answers);
        this.checkedChoices = [];
        this.value = [];
        this.lastQuery = null;
        this.searching = false;
        this.lastSourcePromise = null;
        this.default = this.opt.default;
        this.opt.default = null;

        this.paginator = new Paginator(this.screen);

    }

    /**
     * Start the Inquiry session
     * 
     * @param  {Function} callback callback when prompt is done
     * @return {this}
     */
    _run(callback) {

        this.done = callback;

        this.executeSource().then(() => {

            const events = observe(this.rl);

            const validation = this.handleSubmitEvents(
                events.line.map(this.getCurrentValue.bind(this))
            );

            validation.success.forEach(this.onEnd.bind(this));
            validation.error.forEach(this.onError.bind(this));

            events.normalizedUpKey.takeUntil(validation.success).forEach(this.onUpKey.bind(this));
            events.normalizedDownKey.takeUntil(validation.success).forEach(this.onDownKey.bind(this));
            events.spaceKey.takeUntil(validation.success).forEach(this.onSpaceKey.bind(this));

            // If the search is enabled
            if (!this.opt.searchable) {

                events.numberKey.takeUntil(validation.success).forEach(this.onNumberKey.bind(this));
                events.aKey.takeUntil(validation.success).forEach(this.onAllKey.bind(this));
                events.iKey.takeUntil(validation.success).forEach(this.onInverseKey.bind(this));

            } else {

                events.keypress.takeUntil(validation.success).forEach(this.onKeypress.bind(this));

            }

            if (this.rl.line) {
                this.onKeypress();
            }

            // Init the prompt
            cliCursor.hide();
            this.render();

        });

        return this;

    }

    /**
     * Execute the source function to get the choices and render them
     */
    executeSource() {

        const sourcePromise = null;

        // Remove spaces
        this.rl.line = this.rl.line.trim();

        // Same last search query that already loaded
        if (this.rl.line === this.lastQuery) {
            return;
        }

        // If the search is enabled
        if (this.opt.searchable) {
            sourcePromise = this.opt.source(this.answers, this.rl.line);
        } else {
            sourcePromise = this.opt.source(this.answers, null);
        }

        this.lastQuery = this.rl.line;
        this.lastSourcePromise = sourcePromise;
        this.searching = true;

        sourcePromise.then(choices => {

            // Is not the last issued promise
            if (this.lastSourcePromise !== sourcePromise) {
                return;
            }

            // Reset the searching status
            this.searching = false;

            // Save the new choices
            this.choices = new Choices(choices, this.answers);

            // Foreach choice
            this.choices.forEach(function (choice) {

                // Is the current choice included in the current checked choices
                if (this.value.findIndex(val => isEqual(val, choice.value)) != -1) {
                    this.toggleChoice(choice, true);
                } else {
                    this.toggleChoice(choice, false);
                }

                // The default is not applied yet
                if (this.default) {

                    // Is the current choice included in the default values
                    if (this.default.findIndex(val => isEqual(val, choice.value)) != -1) {
                        this.toggleChoice(choice, true);
                    }

                }

            });

            // Reset the pointer to select the first choice
            this.pointer = 0;
            this.render();
            this.default = null;
            this.firstSourceLoading = false;


        });

        return sourcePromise;

    }

    /**
     * Render the prompt
     * 
     * @param  {Object} error
     */
    render(error) {

        // Render question
        const message = this.getQuestion();
        const bottomContent = '';

        // Answered
        if (this.status === 'answered') {

            message += chalk.cyan(this.selection.join(', '));
            return this.screen.render(message, bottomContent);

        }

        // No search query is entered before
        if (this.firstSourceLoading) {

            // If the search is enabled
            if (this.opt.searchable) {

                message +=
                    '(Press ' +
                    chalk.cyan.bold('<space>') +
                    ' to select, ' +
                    'or type anything to filter the list)';

            } else {

                message +=
                    '(Press ' +
                    chalk.cyan.bold('<space>') +
                    ' to select, ' +
                    chalk.cyan.bold('<a>') +
                    ' to toggle all, ' +
                    chalk.cyan.bold('<i>') +
                    ' to invert selection)';

            }

        }

        // If the search is enabled
        if (this.opt.searchable) {

            // Print the current search query
            message += this.rl.line;

        }

        // Searching mode
        if (this.searching) {

            message += '\n  ' + chalk.cyan('Searching...');

            // No choices
        } else if (!this.choices.length) {

            message += '\n  ' + chalk.yellow('No results...');

            // Has choices
        } else {

            const choicesStr = this.renderChoices(this.choices, this.pointer);

            const indexPosition = this.choices.indexOf(
                this.choices.getChoice(this.pointer)
            );

            message += '\n' + this.paginator.paginate(choicesStr, indexPosition, this.opt.pageSize);

        }

        if (error) {
            bottomContent = chalk.red('>> ') + error;
        }

        this.screen.render(message, bottomContent);

    }

    /**
     * A callback function for the event:
     * When the user press `Enter` key
     * 
     * @param {Object} state
     */
    onEnd(state) {

        this.status = 'answered';

        // Rerender prompt (and clean subline error)
        this.render();

        this.screen.done();
        cliCursor.show();
        this.done(state.value);

    }

    /**
     * A callback function for the event:
     * When something wrong happen
     * 
     * @param {Object} state
     */
    onError(state) {
        this.render(state.isValid);
    }

    /**
     * Get the current values of the selected choices
     * 
     * @return {Array}
     */
    getCurrentValue() {

        this.selection = this.checkedChoices.map(cc => cc.short);
        return this.checkedChoices.map(cc => cc.value);

    }

    /**
     * A callback function for the event:
     * When the user press `Up` key
     */
    onUpKey() {

        const len = this.choices.realLength;
        this.pointer = this.pointer > 0 ? this.pointer - 1 : len - 1;
        this.render();

    }

    /**
     * A callback function for the event:
     * When the user press `Down` key
     */
    onDownKey() {

        const len = this.choices.realLength;
        this.pointer = this.pointer < len - 1 ? this.pointer + 1 : 0;
        this.render();

    }

    /**
     * A callback function for the event:
     * When the user press a number key
     */
    onNumberKey(input) {

        if (input <= this.choices.realLength) {
            this.pointer = input - 1;
            this.toggleChoice(this.choices.getChoice(this.pointer));
        }

        this.render();

    }

    /**
     * A callback function for the event:
     * When the user press `Space` key
     */
    onSpaceKey() {

        // When called no results
        if (!this.choices.getChoice(this.pointer)) {
            return;
        }

        this.toggleChoice(this.choices.getChoice(this.pointer));
        this.render();

    }

    /**
     * A callback function for the event:
     * When the user press 'a' key
     */
    onAllKey() {

        const shouldBeChecked = Boolean(
            this.choices.find(function (choice) {
                return choice.type !== 'separator' && !choice.checked;
            })
        );

        this.choices.forEach(function (choice) {
            if (choice.type !== 'separator') {
                choice.checked = shouldBeChecked;
            }
        });

        this.render();

    }

    /**
     * A callback function for the event:
     * When the user press `i` key
     */
    onInverseKey() {

        this.choices.forEach(function (choice) {
            if (choice.type !== 'separator') {
                choice.checked = !choice.checked;
            }
        });

        this.render();

    }

    /**
     * A callback function for the event:
     * When the user press any key
     */
    onKeypress() {

        this.executeSource();
        this.render();

    }

    /**
     * Toggle (check/uncheck) a specific choice
     *
     * @param {Boolean} checked if not specified the status will be toggled
     * @param {Object}  choice
     */
    toggleChoice(choice, checked) {

        // Default value for checked
        if (typeof checked === 'undefined') {
            checked = !choice.checked;
        }

        // Remove the choice's value from the checked values
        this.value = this.value.filter(val => !isEqual(val, choice.value));

        // Remove the checkedChoices with the value of the current choice
        this.checkedChoices = this.checkedChoices.filter(checkedChoice => {
            return !isEqual(choice.value, checkedChoice.value);
        });

        choice.checked = false;

        // Is the choice checked
        if (checked) {
            this.value.push(choice.value);
            this.checkedChoices.push(choice);
            choice.checked = true;
        }

    }

    /**
     * Get the checkbox figure (sign)
     * 
     * @param  {Boolean} checked
     * @return {String}
     */
    getCheckboxFigure(checked) {

        return checked ? chalk.green(figures.radioOn) : figures.radioOff;

    }

    /**
     * Render the checkbox choices
     * 
     * @param  {Array}  choices
     * @param  {Number} pointer the position of the pointer
     * @return {String} rendered content
     */
    renderChoices(choices, pointer) {

        const output = '';
        const separatorOffset = 0;

        // Foreach choice
        choices.forEach((choice, index) => {

            // Is a separator
            if (choice.type === 'separator') {

                separatorOffset++;
                output += ' ' + choice + '\n';
                return;

            }

            // Is the choice disabled
            if (choice.disabled) {

                separatorOffset++;
                output += ' - ' + choice.name;
                output += ' (' + (isString(choice.disabled) ? choice.disabled : 'Disabled') + ')';
                output += '\n';
                return;

            }

            // Is the current choice is the selected choice
            if (index - separatorOffset === pointer) {

                output += chalk.cyan(figures.pointer);
                output += this.getCheckboxFigure(choice.checked) + ' ';
                output += this.opt.highlight ? chalk.gray(choice.name) : choice.name;

            } else {

                output += ' ' + this.getCheckboxFigure(choice.checked) + ' ' + choice.name;

            }

            output += '\n';


        });

        return output.replace(/\n$/, '');

    }

}

module.exports = CheckboxPlusPrompt;