const baseUrl = 'https://codequotient.com/api/';
const LANGUAGES = [
    {
        lang: "Python",
        val: 0
    },
    {
        lang: "Java",
        val: 8
    },
    {
        lang: "JavaScript",
        val: 4
    },
    {
        lang: "C",
        val: 7
    },
    {
        lang: "C++",
        val: 77
    }
];
const ol = document.getElementsByTagName('ol')[0];
const textarea = document.getElementsByTagName('textarea')[0];
const compileBtn = document.getElementsByTagName('button')[0];
const output = document.getElementById('output');
const language = document.getElementsByTagName('select')[0];
var start = 1;

language.addEventListener('change', () => {
    output.innerHTML = "";
    switch(language.value) {
        case '0': 
            textarea.value = `# Write your code here\nprint('Hello World')`;
            break;
        case '4':
            textarea.value = `// Write your code here\nconsole.log('Hello World');`;
            break; 
        case '7':
            textarea.value = `#include <stdio.h>\n\nint main() {\n // Write your code here\n printf("Hello World");\n}`
            break;
        case '77':
            textarea.value = `#include <iostream>\nusing namespace std;\n\nint main() {\n // Write your code here\n cout<<"Hello World";\n}`
            break;        
        case '8':
            textarea.value = `class Main {\n  public static void main(String[] args) {\n   // Write your code here\n   System.out.println("Hello World");\n }\n}`
            break;               

    }
});

async function showOutput(codeId) {
    output.innerHTML = 'Executing...';
    fetch(baseUrl + 'codeResult/' + codeId)
    .then((response) => {
        if(response.ok) return response.json();
        else throw new Error('Error: ' + response.status + ' ' + response.statusText);
    }).then((response) => {
        response = JSON.parse(response.data);
        console.log(response);
        if(response.output) {
            let op = JSON.stringify(response.output).replaceAll(/\"/g, "");
            output.innerHTML = op.substring(2).replaceAll(/\\n/g, '<br />');
        }
        else if(response.errors) {
            let op = JSON.stringify(response.errors).replaceAll(/\"/g, "");
            output.innerHTML = op.replaceAll(/\\n/g, '<br />');
        }
        else setTimeout(() => showOutput(codeId), 1000);
    }).catch((err) => console.log(err.message));
}

async function getResult(langId, code) {
    output.innerHTML = 'Compiling...';
    
    fetch('https://codequotient.com/api/executeCode', {
        method: 'POST',
        body: JSON.stringify({ langId, code }),
        headers: { "Content-Type": "application/json" },
    }).then((response) => {
        if(response.ok) return response.json();
        else throw new Error('Error: ' + response.status + ' ' + response.statusText);
    }).then((response) => {
        if(response.codeId) showOutput(response.codeId);
        else output.innerHTML = response.error;
    }).catch((err) => console.log(err.message));
}

compileBtn.addEventListener('click', async function() {
    getResult(language.value, textarea.value);
})

function setNumbering() {
    ol.innerHTML = '';
    for(let i = start; i < start + 15; i++) {
        li = document.createElement('li');
        num = document.createTextNode(i);
        li.appendChild(num);
        ol.appendChild(li);
    }
}

function setLanguages() {
    LANGUAGES.map(function(obj) {
        let option = document.createElement('option');
        option.value = obj.val;
        option.innerText = obj.lang;
        language.appendChild(option);
    })
}

textarea.addEventListener('scroll', function(e) {
    start = parseInt(e.target.scrollTop / 24 + 1);
    setNumbering();
});

function setup() {
    setNumbering();
    setLanguages();
}

setup();