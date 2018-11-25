const express = require('express');
const path = require('path')
var zeroFill = require('zero-fill')
const PORT = process.env.PORT || 8080
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || "mongodb://mybarn:mybarn123@ds151533.mlab.com:51533/mybarn";
var bodyParser = require('body-parser');
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
                goToRegister(res);
            } else if (page == "breeding") {
                goToBreeding(res);
            } else {
                var pageData = {
                    page: page,
                    data: null,
                    error: "All Good"
                };
                res.render("index", pageData)
            }
        } else
            res.render("index", {
                error: page + " doesn't exist or you are not authorized to view this page. Contact adminstrator for more details.",
                data: null,
                page: "error"
            })
    })
    .post('/register', function (req, res) {

        var data = {
            "id": req.body.cattleId,
            "gender": req.body.gender,
            "animalType": req.body.animalType,
            "breed": req.body.breed,
            "color": req.body.color,
            "descriptionAndComments": req.body.descriptionAndComments,
            "dateOfBirth": req.body.dateOfBirth,
            "dateOfRegstration": new Date(),
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
        insertData("cattle", data)
        var pageData = {
            page: "details",
            data: null,
            error: "All Good"
        };
        res.render("index", pageData)

    })
    .post('/breeding', function (req, res) {
        var data = {
            "maleId": req.body.maleId,
            "femaleId": req.body.femaleId,
            "breedingDate": req.body.breedingDate,
            "expectedDeliveryDate": req.body.expectedDeliveryDate
        }
        insertData("breeding", data)
        goToBreeding(res)

    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

//collection.find().sort({goals:-1}, function(err, cursor){...});

function insertData(collection, data) {
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, function (err, db) {
        var dbo = db.db("mybarn");

        if (err) throw err;
        dbo.collection(collection).insertOne(data, function (err, res) {
            if (err) {
                throw err;
                condole.log(err)
            }
            console.log("1 document inserted");

            db.close();
        });
    });
}

function goToBreeding(res) {
    MongoClient.connect(url, {
            useNewUrlParser: true
        },
        function (err, db) {
            var dbo = db.db("mybarn");
            if (err) throw err;
            dbo.collection("breeding").find().sort({
                expectedDeliveryDate: -1
            }).toArray(function (err, result) {
                if (err) throw err;
                console.log(result)
                var pageData = {
                    page: "breeding",
                    data: result,
                    error: "All Good"
                };
                res.render("index", pageData)
                db.close();
            });
        });
}

function goToRegister(res) {
    MongoClient.connect(url, {
            useNewUrlParser: true
        },
        function (err, db) {
            var dbo = db.db("mybarn");
            if (err) throw err;
            dbo.collection("cattle").find().sort({
                id: -1
            }).toArray(function (err, result) {
                if (err) throw err;
                var tempId = zeroFill(6, 1).toString()
                if (result.length != '0')
                    tempId = zeroFill(6, Number(result[0].id) + 1).toString()
                console.log(tempId)
                var pageData = {
                    page: "register",
                    data: tempId,
                    error: "All Good"
                };
                res.render("index", pageData)
                db.close();
            });
        });
}


function generateCode() {}