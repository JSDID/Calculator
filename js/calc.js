class Calculator {

    constructor(id) {
        this.calcElem = document.getElementById(id);
        this.calcElem.classList.add('calc-body');
        // Удаляем генерацию innerHTML, т.к. разметка теперь в HTML
        this.inputDisplay = this.calcElem.querySelector('.calc-display-result');
        this.formulaDisplay = this.calcElem.querySelector('.calc-display-formula');
        this.formula = '';
        this.result = 0; //посчитанное
        this.resultLast = 0;
        this.inputLast = 0; //предыдущее введенное
        this.input = '0'; //текущее введенное
        this.operation = '+';
        this.opFlag = 0;
        this.equateFlag = 0;
        this.clear = 0;

        //memory module
        this.memory = 0;
        this.memoryElems = this.calcElem.querySelectorAll('.disabled');
        this.memoryControls = 0;

        //events
        this.calcElem.addEventListener('click', this.eventHandler.bind(this));
    }

    eventHandler (event) {
        let target = event.target;

        while (target != this.calcElem) {
            if (target.classList.contains('calc-buttons-numbers')) {
                this.addDigit(+target.innerHTML);
                return;
            }
            if (target.classList.contains('calc-buttons-operations')) {
                this.addOperation(target.dataset.value);
                return;
            }
            if (target.classList.contains('calc-buttons-comma')) {
                this.addComma();
                return;
            }
            if (target.classList.contains('calc-buttons-negate')) {
                this.negate();
                return;
            }
            if (target.classList.contains('calc-buttons-remove-digit')) {
                this.removeDigit();
                return;
            }
            if (target.classList.contains('calc-buttons-clear-data')) {
                this.clearData();
                return;
            }
            if (target.classList.contains('calc-buttons-clear-entry')) {
                this.clearEntry();
                return;
            }
            if (target.classList.contains('calc-buttons-access-memory')) {
                this.accessMemory(target.dataset.value);
                return;
            }
            target = target.parentNode;
        }
    }

    activateMemoryControls (flag) {
        if(flag) {
            this.memoryElems.forEach(function (item) {
                item.classList.remove('disabled');
            })
            this.memoryControls = 1;
        }
        else {
            this.memoryElems.forEach(function (item) {
                item.classList.add('disabled');
            })
            this.memoryControls = 0;
        }
    }

    accessMemory (op) {
        var tempInput;

        if(this.input !== ''){
            tempInput = +this.input
        }
        else {
            tempInput = this.result;
        }

        switch(op) {
            case 'save':
                this.memory = tempInput;
                this.activateMemoryControls(true);
                break;
            case 'add':
                this.memory += tempInput;
                this.activateMemoryControls(true);
                break;
            case 'sub':
                this.memory -= tempInput;
                this.activateMemoryControls(true);
                break;
            case 'show':
                if(this.memoryControls) {
                this.formula = '';
                this.input = '' + this.memory;
                this.refreshDisplays();
                this.input = '';
                }
                break;
            case 'clear':
                this.memory = 0;
                this.activateMemoryControls(false);
                break;
            default:
                break;
        }


    }



    refreshDisplays() {
        this.inputDisplay.innerHTML = this.formatComma(this.input);
        this.formulaDisplay.innerHTML = this.formatComma(this.formula);
    }

    formatComma(str) {
        let newString = str.slice();
        while (~newString.indexOf('.')) {
            newString = newString.replace('.', ',');
        }
        return newString;
    }

    calculate() {
        if(!this.opFlag) {
            switch (this.operation) {
                case '+':
                    this.result += +this.input;
                    break;
                case '-':
                    this.result -= +this.input;
                    break;
                case '*':
                    this.result *= +this.input;
                    break;
                case '/':
                    this.result /= +this.input;
                    break;
                default:
                    break;
            }
            this.result = +this.result.toFixed(11);
        }
    }

    addOperation(op) {
            switch (op) {
                case '+':
                case '-':
                case '*':
                case '/':
                    if(this.equateFlag === 1) {
                        this.result = 0;
                        this.operation = "+";
                        this.equateFlag = 0;
                    }
                    this.calculate();
                    this.operation = op;
                    if(this.opFlag) {
                        this.formula = this.formula.slice(0,-2);
                        this.formula += this.operation + ' ';
                    }
                    else {
                        this.formula += this.input + ' ' + this.operation + ' ';
                        this.opFlag = 1;
                    }

                    this.inputLast = +this.input;
                    this.input = '' + this.result;
                    this.refreshDisplays();
                    this.input = '';
                    break;
                case '=':
                    if(this.equateFlag === 1) {
                        this.result = +this.input;
                        this.input = '' + this.inputLast;
                        this.calculate();
                        this.input = '' + this.result;
                        this.refreshDisplays();
                        break;
                    }
                    this.calculate();
                    this.inputLast = +this.input || this.inputLast;
                    this.equateFlag = 1;
                    this.input = '' + this.result;
                    this.formula = '';
                    this.refreshDisplays();
                    this.clear = 1;
                    this.opFlag = 0;
                    break;
                default:
                    if(this.equateFlag === 1) {
                        this.result = 0;
                        this.operation = "+";
                        this.equateFlag = 0;
                    }
                    this.process(op);
                    this.resultLast = this.resultLast || this.result;
                    if(op != '%') this.calculate();
                    if(op != '%') this.formula += '=';
                    this.refreshDisplays();
                    if(op != '%') this.result = 0;
                    break;
            }
    }

    process(op) {
        switch (op) {
            case '1/x':
                this.formula += '1/(' + this.input + ')';
                this.input = '' + (1 / +this.input);
                break;
            case 'sqr':
                this.formula += 'sqr(' + this.input + ')';
                this.input = '' + (Math.pow(+this.input,2));
                break;
            case 'sqrt':
                this.formula += 'sqrt(' + this.input + ')';
                this.input = '' + (Math.sqrt(+this.input));
                break;
            case '%':
                this.result = this.result || this.resultLast;
                this.resultLast = 0;
                this.input = '' + (this.result * +this.input / 100);
                this.formula += '' + this.input;
                break;
            default:
                break;
        }
        this.opFlag = 0;
    }

    addDigit(digit) {
        if(this.clear === 1) {
            this.input = '0';
            this.clear = 0;
            this.inputLast =0;
        }
        if (!isNaN(digit)) {
            (this.input === '0') ? this.input = '' + digit : this.input += '' + digit;

            this.opFlag = 0;
        }
        this.refreshDisplays();
    }

    addComma() {
        if(this.clear === 1) {
            this.input = '0';
            this.clear = 0;
        }
        if (!~this.input.indexOf('.')) this.input += '.';
        this.opFlag = 0;
        this.refreshDisplays();
    }

    removeDigit() {
        if (this.input !== '0') {
            this.input = this.input.slice(0, -1);
            if (!this.input.length) this.input = '0';
        }
        this.refreshDisplays();
    }

    negate() {
        if(this.input != 0) {
            (~this.input.indexOf('-')) ? this.input = this.input.slice(1) : this.input = '-' + this.input;
            this.refreshDisplays();
        }
    }

    clearEntry() {
        this.input = '0';
        this.refreshDisplays();
    }

    clearData() {
        this.formula = '';
        this.result = 0;
        this.input = '0';
        this.opFlag = 0;
        this.equateFlag = 0;
        this.inputLast = 0;
        this.operation = '+';
        this.refreshDisplays();
    }

}

