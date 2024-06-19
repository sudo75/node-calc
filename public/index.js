window.onload = () => {
    outputUI();
}

function outputUI() {
    fetch('/output', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'data', action: 'all' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        updateUI(data.output.ln0, data.output.ln1);
    })
    .catch(error => {
        console.error(error);
    });
}


console.log('public JS running');

document.addEventListener('keypress', (event) => {
    const key = event.key;

    let commandID;
    switch (key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            commandID = key;
            break;

        case 'c':
            commandID = 'clear';
            break;
        case 'd':
            commandID = 'del';
            break;

        case 'Enter':
        case '=':
            commandID = 'eq';
            break;

        case '.':
            commandID = 'dot';
            break;

        case '*':
            commandID = 'mul';
            break;
        case '/':
            commandID = 'div';
            break;
        case '+':
            commandID = 'add';
            break;
        case '-':
            commandID = 'sub';
            break;
        case '^':
            commandID = 'exp';
            break;

    }

    //Set styling
    const allBtns = document.querySelectorAll('.btn');
    allBtns.forEach((btn) => {
        if (btn.id === commandID) {

            function reset() {
                btn.classList.remove('key-active');
                btn.classList.remove('key-hover');
            }

            btn.classList.add('key-hover');
            btn.classList.add('key-active');
            setTimeout(reset, 150);
            
        }
    });

    const { type, action } = getCommandByID(commandID);
    sendReq(type, action);

});

document.addEventListener('click', (event) => {

    const target = event.target;
    const selection = window.getSelection();

    if (target.classList.contains('ln')) {

        if (selection.toString().length > 0) {
            navigator.clipboard.writeText(target.innerText);
            log("Text Copied!");
        }
        return;
    } else if (target.classList.contains('btn')) {
        const { type, action } = getCommandByID(target.id);
        sendReq(type, action);
    }

    selection.removeAllRanges();
});

function getCommandByID(id) {
    let action;
    let type;

    switch (id) {
        case "clear":
            type = 'ctrl';
            action = 'clear';
            break;
        case "del":
            type = 'ctrl';
            action = 'del';
            break;
        case "exp":
            type = 'op';
            action = 'exp';
            break;
        case "div":
            type = 'op';
            action = 'div';
            break;

        case "7":
            type = 'num';
            action = 7;
            break;
        case "8":
            type = 'num';
            action = 8;
            break;
        case "9":
            type = 'num';
            action = 9;
            break;
        case "mul":
            type = 'op';
            action = 'mul';
            break;

        case "4":
            type = 'num';
            action = 4;
            break;
        case "5":
            type = 'num';
            action = 5;
            break;
        case "6":
            type = 'num';
            action = 6;
            break;
        case "sub":
            type = 'op';
            action = 'sub';
            break;

        case "1":
            type = 'num';
            action = 1;
            break;
        case "2":
            type = 'num';
            action = 2;
            break;
        case "3":
            type = 'num';
            action = 3;
            break;
        case "add":
            type = 'op';
            action = 'add';
            break;

        case "posNeg":
            type = 'ctrl'
            action = 'posNeg';
            break;
        case "0":
            type = 'num';
            action = 0;
            break;
        case "dot":
            type = 'num';
            action = '.';
            break;
        case "eq":
            type = 'ctrl';
            action = 'eq';
            break;

        default:
            break;
    }

    return { action, type };
}

function sendReq(type, action) {
    if ((!action || !type) && !(action !== 0 || type !== 0)) {
        return;
    }

    fetch('/input', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: type, action: action })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch input response');
        }
        return response.json();
    })
    .then(data => {
        updateUI(data.output.ln0, data.output.ln1);
    })
    .catch(error => {
        console.error(error);
    });
}

const interval_outputUI = setInterval(() => {
    outputUI();
}, 50);

function updateUI(output0, output1) {
    document.getElementById('ln0').innerText = output0;
    document.getElementById('ln1').innerText = output1;
}

function log(text) {
    const log = document.querySelector('.log');
    log.classList.remove('hidden');

    log.innerText = text;

    setTimeout(() => {
       log.classList.add('hidden');
    }, 2000);
}