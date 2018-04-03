const INPUT = __dirname + "/photo-before/";
const OUTPUT = __dirname + "/photo-after/";

function input(name) {
    return INPUT + name + '.jpg';
}

function output (name) {
    return OUTPUT + name + '.jpg';
}

// module.exports = {input, output};

module.exports = {input, output};