const Jimp = require('jimp');

const {input, output} = require('./utils');

(async function make (inputFileName, w, h) {
    try {
        const image = await Jimp.read(input(inputFileName));

        await image
        .cover(w, h)
        .write(output(`${inputFileName}-Crop-${w}x${h}`));

        console.log('process done.')

    }catch (e) {
        console.log(e);
    }
})(1, 1000, 1000);








