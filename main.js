const express = require('express');
const path = require('path')
const PORT = process.env.PORT || 8080
var app = express();

app
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('index', {
        page: "index"
    }))
    .get('/:page', function (req, res) {
        var page = req.params.page;
        console.log(page);
        res.render("index", {
            page: page
        })
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))