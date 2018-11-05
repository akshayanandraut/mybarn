const express = require('express');
const path = require('path')
const PORT = process.env.PORT || 8080
var app = express();
var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://mybarn:mybarn123@ds151533.mlab.com:51533/mybarn";
var bodyParser = require('body-parser');
var url=process.env.MONGODB_URI
app
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('index', {
        page: "index",
        data: null,
        error: "All Good"
    }))

.get('/:page', function (req, res) {
        var page = req.params.page;
        console.log(page);
        if (page == "index" || page == "register" || page == "details" || page == "breeding" || page == "dailyUpdates") {
            if (page == "register") {
                MongoClient.connect(url, {
                        useNewUrlParser: true
                    },
                    function (err, db) {
                        var dbo = db.db("mybarn");
                        if (err) throw err;
                        dbo.collection("cattle").find().sort({
                            _id: -1
                        }).toArray(function (err, result) {
                            if (err) throw err;
                            var pageData = {
                                page: page,
                                data: result[0].id + 1,
                                error: "All Good"
                            };
                            res.render("index", pageData)
                            db.close();
                        });
                    });
            }
            var pageData={
                page: page,
                data: null,
                error: "All Good"
            }
            res.render("index", pageData)

        } else
            res.render("index", {
                error: page + " doesn't exist or you are not authorized to view this page. Contact adminstrator for more details.",
                data: null,
                page: "error"
            })
    })
    .post('/register', function (req, res) {
        var data = {
            "id": req.body.id,
            "gender": req.body.gender,
            "breed": req.body.breed,
            "color": req.body.color,
            "descriptionAndComments": req.body.descriptionAndComments,
            "dateOfBirth": req.body.dateOfBirth,
            "dateOfDeath": null,
            "parents": {
                "motherId": req.body.motherId,
                "fatherId": req.body.fatherId
            },
            "vaccinationDetails": [{
                "dosageDate": req.body.dosageDate,
                "vaccine": req.body.vaccine,
                "vaccineDescription": req.body.vaccineDescription,
                "healthStatus": req.body.healthStatusDuringVaccination,
                "healthDescription": req.body.healthDescription
            }],
            "dailyHealth": [{
                "healthCheckDate": null,
                "healthStatus": 0.0,
                "healthDescription": null
            }],
            "lactation": {
                "expectedQuantityInLitersPerDay": req.body.expectedQuantityInLitersPerDay,
                "actualQuantityInLitersPerDay": [{
                    "date": null,
                    "quantity": null
                }]
            },
            "diet": [{
                "date": null,
                "food": null,
                "quantityInKgs": null
            }]
        };
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, db) {
            var dbo = db.db("mybarn");

            if (err) throw err;
            // dbo.collection("cattle").insertOne(data, function (err, res) {
            //     if (err) {
            //         res.send("Could not register cattle with ID: " + id + ". Please check the details and try again.");
            //         throw err;
            //     }
            //     console.log("1 document inserted");
            //     res.send("Successfully reistered the cattle with ID: " + id);
            //     db.close();
            // });
        });


    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

//collection.find().sort({goals:-1}, function(err, cursor){...});
