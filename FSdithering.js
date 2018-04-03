const Jimp = require('jimp');

const INPUT = __dirname + "/photo-before/";
const OUTPUT = __dirname + "/photo-after/";

function input(name) {
    if (!name instanceof String) name = name.toString();
    return INPUT + name + '.jpg';
}

function output (name) {
    if (!name instanceof String) name = name.toString();
    return OUTPUT + name + '.jpg';
}

/**
 * @description Floyd–Steinberg dithering
 * 
 * Floyd–Steinberg dithering is an image dithering algorithm first published in 1976 by Robert W. Floyd and Louis Steinberg. 
 * It is commonly used by image manipulation software, 
 * for example when an image is converted into GIF format that is restricted to a maximum of 256 colors.
 * 
 * The algorithm achieves dithering using error diffusion, 
 * meaning it pushes (adds) the residual quantization error of a pixel onto its neighboring pixels, 
 * to be dealt with later.
 * 
 * In the following pseudocode we can see the algorithm described above. 
 * The values of the input image's pixels are normalized in floating point format to [0,1] with 0 (black) and 1 (white).
 * 
 *  for each y from top to bottom
 *      for each x from left to right
 *          oldpixel  := pixel[x][y]
 *          newpixel  := find_closest_palette_color(oldpixel)
 *          pixel[x][y]  := newpixel
 *          quant_error  := oldpixel - newpixel
 *          pixel[x + 1][y    ] := pixel[x + 1][y    ] + quant_error * 7 / 16
 *          pixel[x - 1][y + 1] := pixel[x - 1][y + 1] + quant_error * 3 / 16
 *          pixel[x    ][y + 1] := pixel[x    ][y + 1] + quant_error * 5 / 16
 *          pixel[x + 1][y + 1] := pixel[x + 1][y + 1] + quant_error * 1 / 16
 * 
 */

const BIT = 1; // total color number of scaling down to

async function dithering(inputFile, outputFile) {
    try {
        const image = await Jimp.read(input(inputFile));
        
        const data = image.bitmap.data;  // a Buffer of the raw bitmap data 
        const width = image.bitmap.width; // the width of the image 
        const height = image.bitmap.height // the height of the image 

        image
        // apply 'greyscale' filter
        .color([
            // {apply: 'blue', params: [-200]},
            {apply: 'greyscale', params: []}
        ])
        // change every pixels
        .scan(0, 0, width, height, function (x, y, idx) {
            // x, y is the position of this pixel on the image 
            // idx is the position start position of this rgba tuple in the bitmap Buffer 
            // this is theimage 

            const red   = this.bitmap.data[ idx + 0 ]; // original RED color
            const green = this.bitmap.data[ idx + 1 ]; // original GREEN color
            const blue  = this.bitmap.data[ idx + 2 ]; // original BLUE color
            const alpha = this.bitmap.data[ idx + 3 ]; // original ALPHA value
            // rgba values run from 0 - 255 
            // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel 

            const r = Math.round(BIT * red   / 255) * (255 / BIT); // scaled RED by BIT
            const g = Math.round(BIT * green / 255) * (255 / BIT); // scaled GREEN by BIT
            const b = Math.round(BIT * blue  / 255) * (255 / BIT); // scaled BLUE by BIT

            // make this pixel to new value - set_closest_palette_color
            this.bitmap.data[ idx + 0 ] = r;
            this.bitmap.data[ idx + 1 ] = g;
            this.bitmap.data[ idx + 2 ] = b;
            
            // conculate ERROR
            const errR = red - r;
            const errG = green - g;
            const errB = blue - b;

            // find neighbor pixels {banned}
            // const index1 = image.getPixelIndex(x + 1, y    ); // returns the index within image.bitmap.data 
            // const index2 = image.getPixelIndex(x - 1, y + 1); // returns the index within image.bitmap.data 
            // const index3 = image.getPixelIndex(x    , y + 1); // returns the index within image.bitmap.data 
            // const index4 = image.getPixelIndex(x + 1, y + 1); // returns the index within image.bitmap.data 
            
            // find neighbor pixels {in-use}
            const neighborPixels = [
                {
                    pixel: image.getPixelIndex(x + 1, y    ),
                    method: quant_error => quant_error * 7 / 16
                },
                {
                    pixel: image.getPixelIndex(x - 1, y + 1),
                    method: quant_error => quant_error * 3 / 16
                },
                {
                    pixel: image.getPixelIndex(x    , y + 1),
                    method: quant_error => quant_error * 5 / 16
                },
                {
                    pixel: image.getPixelIndex(x + 1, y + 1),
                    method: quant_error => quant_error * 1 / 16
                }
            ]

            // for every current pixel, dithering its surrounding pixels
            for (let j in neighborPixels) {
                let i = neighborPixels[j];
                this.bitmap.data[ i.pixel + 0 ] += i.method(errR);
                this.bitmap.data[ i.pixel + 1 ] += i.method(errG);
                this.bitmap.data[ i.pixel + 2 ] += i.method(errB);
            }
        })
        // color correction
        // remove RED && GREEN dots
        // .scan(0, 0, width, height, function (x, y, idx) {
        //     const red   = this.bitmap.data[ idx + 0 ]; // original RED color
        //     const green = this.bitmap.data[ idx + 1 ]; // original GREEN color
        //     const blue  = this.bitmap.data[ idx + 2 ]; // original BLUE color

        //     const max = Math.max(red, green, blue);
        //     const min = Math.min(red, green, blue);

        //     const order = {
        //         max: {
        //             color: null,
        //             value: 0
        //         },
        //         mid: {
        //             color: null,
        //             value: 0
        //         },
        //         min: {
        //             color: null,
        //             value: 0
        //         }
        //     };


        //     if (max == red && max > 250) {
        //         this.bitmap.data[ idx + 0 ] = this.bitmap.data[ idx + 2 ];
        //     }else if (max == green && max > 250) {
        //         this.bitmap.data[ idx + 1 ] = this.bitmap.data[ idx + 2 ];
        //     }else if (min == 0 && min == green && Math.floor((red + blue) / 2) > 180) {
        //         this.bitmap.data[ idx + 1 ] = Math.floor((red + blue) / 2);
        //     }else if (max == red && red > 230 && green == 0 && blue == 0) {
        //         this.bitmap.data[ idx + 1 ] = red;
        //         this.bitmap.data[ idx + 2 ] = red;
        //     }else if (red == green && green > 230 && blue < 10) {
        //         this.bitmap.data[ idx + 0 ] = blue;
        //         this.bitmap.data[ idx + 1 ] = blue;
        //     }

        // })
        .write(output(outputFile));
    }catch(err) {
        console.log(err);
    }
}

dithering('new', `FSdithering-${BIT}`);