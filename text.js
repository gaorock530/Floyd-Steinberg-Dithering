const Jimp = require('jimp');

const {input, output} = require('./utils');

(async function make (inputFileName, w, h, text) {
    try {
        const image = await Jimp.read(input(inputFileName));
        const font = await Jimp.loadFont( Jimp.FONT_SANS_128_BLACK );

        await image
        .cover(w, h)
        .print(font, 10, 10, text)
        .write(output(`${inputFileName}-Text-${w}x${h}`));

        console.log('process done.');

    }catch (e) {
        console.log(e);
    }
})(1, 500, 500, "Magic");