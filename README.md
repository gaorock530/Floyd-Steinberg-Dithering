## Floyd-Steinberg-Dithering
My Email: <gaorock530@hotmail.com>

#### Ref: 
1. [Stippling](http://roberthodgin.com/portfolio/stippling/)
2. [Wikipedia](https://en.wikipedia.org/wiki/Floyd–Steinberg_dithering)

#### Algorithm:

![error diffusion](https://wikimedia.org/api/rest_v1/media/math/render/svg/ad305726a5720c59f10c8beb3057c78d43f1fed0)

#### Pseudocode:

```
for each y from top to bottom
    for each x from left to right
        oldpixel  := pixel[x][y]
        newpixel  := find_closest_palette_color(oldpixel)
        pixel[x][y]  := newpixel
        quant_error  := oldpixel - newpixel
        pixel[x + 1][y    ] := pixel[x + 1][y    ] + quant_error * 7 / 16
        pixel[x - 1][y + 1] := pixel[x - 1][y + 1] + quant_error * 3 / 16
        pixel[x    ][y + 1] := pixel[x    ][y + 1] + quant_error * 5 / 16
        pixel[x + 1][y + 1] := pixel[x + 1][y + 1] + quant_error * 1 / 16
```

#### Other files:

* **utils.js** - a helper
* **crop.js** - resize image and crop the unfit part
* **text.js** - resize and write text to the image
* **FSdithering.js** - the main topic here
---
#### Markdown test:
* **server.js** - html markdown parser server
* **index.html** - front-end