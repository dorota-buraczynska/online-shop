module.exports = {
    entry: [
        './script/script.js',
        './script/blog.js',
        './script/cart.js',
        './script/filter.js',
        './script/map.js',
        './script/nav.js',
        './script/preview.js',
        './script/slider.js'
    ],
    output: {
        path: __dirname,
        filename: './script/out.js'
    },
    watch: true
};
