'use strict';

const {ipcRenderer} = require('electron');


ipcRenderer.on('factorial-computed', (event, input, output) => {
    const message = `The factorial of ${input} is ${output}`;
    console.log(message);
});
