function setup(app) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));  // Send the index.html file as the response
    });

    app.post('/output', (req, res) => {
        
        let output = calc.getOutput();
        res.json({ output });
    });

    app.post('/input', (req, res) => {

        switch (req.body.type) {
            case "num":
                calc.inputNum(req.body.action);
                break;
            case "ctrl":
                switch (req.body.action) {
                    case "clear":
                        calc.clear();
                        break;
                    case "eq":
                        calc.eval();
                        break;
                    case "del":
                        calc.del();
                        break;
                    case "posNeg":
                        calc.posNeg();
                        break;
                    
                }
                break;
            case "op":
                if (calc.op.id) {
                    calc.eval();
                }
                if (calc.ans) {
                    const _ans = calc.ans;
                    calc.clear();
                    calc.num0 = String(_ans);
                }
                switch (req.body.action) {
                    case "add":
                        calc.op.out = '+';
                        calc.op.id = 'add';
                        break;
                    case "sub":
                        calc.op.out = '-';
                        calc.op.id = 'sub';
                        break;
                    case "mul":
                        calc.op.out = '×';
                        calc.op.id = 'mul';
                        break;
                    case "div":
                        calc.op.out = '÷';
                        calc.op.id = 'div';
                        break;
                    case "exp":
                        calc.op.out = '^';
                        calc.op.id = 'exp';
                        break;
                }
                break;
        }

        output = calc.getOutput();

        res.json({ output });
    });
}

class Calc {
    constructor() {
        this.num0 = '';
        this.num1 = '';
        this.op = {
            id: '',
            out: ''
        };
        this.ans = '';
    }

    del() {
        if (this.num1) {
            this.num1 = this.num1.slice(0, this.num1.length - 1);
        } else if (this.op.id) {
            this.op = {
                id: '',
                out: ''
            };
        } else if (this.num0) {
            this.num0 = this.num0.slice(0, this.num0.length - 1);
        }
    }

    posNeg() {
        if (this.num1) {
            if (this.num1.includes('-')) {
                this.num1 = this.num1.slice(1);
            } else {
                this.num1 = '-' + this.num1;
            }
        } else if (this.op.id) {
        } else if (this.num0) {
            if (this.num0.includes('-')) {
                this.num0 = this.num0.slice(1);
            } else {
                this.num0 = '-' + this.num0;
            }
        }
    }

    getOutput() {
        const ln0 = this.num0 + this.op.out + this.num1;
        const ln1 = this.ans;
        return { ln0, ln1 };
    }

    inputNum(num) {
        if (this.num0.length + this.num1.length >= 16) {
            return;
        }

        if (this.ans) {
            this.clear();
        }

        if (!this.op.id) {
            if (num === '.' && this.num0.includes(num)) {
                return;
            }
            this.num0 += num;
        } else {
            if (num === '.' && this.num1.includes(num)) {
                return;
            }
            this.num1 += num;
        }
    }

    eval() {
        if ((!this.num0 && this.num0 !== 0) || !this.op.id || (!this.num1 && this.num1 !== 0)) {
            return;
        }

        this.num0 = Number(this.num0);
        this.num1 = Number(this.num1);

        switch (this.op.id) {
            case 'add':
                this.ans = this.num0 + this.num1;
                break;
            case 'sub':
                this.ans = this.num0 - this.num1;
                break;
            case 'mul':
                this.ans = this.num0 * this.num1;
                break;
            case 'div':
                this.ans = this.num0 / this.num1;
                break;
            case 'exp':
                this.ans = this.num0 ** this.num1;
                break;
        }
        this.ans = Math.round(this.ans * 1e8) / 1e8;
    }

    clear() {
        this.num0 = '';
        this.num1 = '';
        this.op = {
            id: '',
            out: ''
        };
        this.ans = '';
    }
}

let calc = new Calc();

// Export the setup function
module.exports = { setup };
