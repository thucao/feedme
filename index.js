
var accountSid = 'ACb9cfc0318c08bd35280794c5faf69ba6'; // Your Account SID from www.twilio.com/console
var authToken = '4da7da54ec1ef46041de82ca2421238c';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);



var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // Required if we need to use HTTP post parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_gzjhgxqd:9pk747armsftmimgcvpmhbsies@ds259305.mlab.com:59305/heroku_gzjhgxqd';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

//Allow cross origin 
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});



app.post('/sendSMS', function(request, response) {
	var msg = request.body.message;
	var num = parseFloat(request.body.number, 10);
	plus = '+1';
	num = plus.concat(num);

	client.messages.create({
	//messagingServiceSid: 'PNf6c108d47b97084033aa98d51d628198',
	to: num,
	from: '+13392040580',
    body: msg,
      // Text this number
     // From a valid Twilio number
    //PNf6c108d47b97084033aa98d51d628198
    //from: 'FeedMeCo',
    //messagingServiceSid: 'FeedMeCo',

})
.then((message) => console.log(message.sid));

response.send(num);
	
});

app.post('/sendFood', function(request, response) {
	var time = new Date();
	var theEvent = request.body.event;
	var theFood = request.body.food;
	var theLat = parseFloat(request.body.lat, 10);
	var theLng = parseFloat(request.body.lng, 10);
	var theBeginning = request.body.beginning;
	var theExpiration = parseFloat(request.body.expiration, 10);
	var theAddress = request.body.address;

	var toInsert = {
		"event": theEvent,
		"food": theFood,
		"lat": theLat,
		"lng": theLng,
		"beginning": theBeginning,
		"expiration":theExpiration,
		"address": theAddress,
		"created_at": time,
	};

	 //cheat
	if (theEvent && theFood && theLat && theLng && theBeginning && theExpiration && theAddress) {
		db.collection('events', function(error, coll) {
			coll.insert(toInsert, function(error, saved) {		
				if (error) {
					response.send(JSON.stringify({"error":"Whoops, something is wrong with your data!"}));
				}
				else {
					db.collection('events').find().toArray(function(error, Pdata) {
						if(!error) {
							response.send(JSON.stringify({"events": Pdata}));							
						}
						else {
							response.send(JSON.stringify({"error":"Whoops, something is wrong with your data!"}));
						}
					});
				}

			});	
		});
	}			 
	else {	
		response.send(JSON.stringify({"3error":"Whoops, something is wrong with your data!"}));		
	}	
});

app.get('/checkins.json', function(request, response) {
	response.set('Content-Type', 'text/html');
	
	var theEvent = request.query.event;
	
	db.collection('checkins', function(error, collection) {
		if(error) {
			response.send(JSON.stringify([]));
		}
		else {
			collection.find({"event":theEvent}).toArray(function(error, results) {
				if(error) {
					response.send(JSON.stringify([]));
				}
				else {
					response.send(JSON.stringify((results)));
				}
			});
		}
	});
});	




app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/data', function(request, response) {
	//response.render('pages/index');
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	

	db.collection('events', function(error, collection) {
		if (!error) {
			collection.find().toArray(function(error, results) {
				if (!error) {
					indexPage += "<!DOCTYPE HTML><html><head><title>Current Food Events</title></head><body><h1>Events</h1>";
					for (var i = results.length - 1; i > -1; i--) {
						var today = new Date();
						var d = new Date(results[i].beginning);
						var eventDate = new Date(d.getTime() + results[i].expiration*60000);
						

						if (today.getTime() < eventDate.getTime()) {
							//alert("The first date is after the second date!");
							indexPage += "<p>" +  results[i].event + " located at " + results[i].lat + ", " + results[i].lng + "</p>" 
							+ "<p>" + "Physical Address: " + results[i].address + "</p>" 
							+ "<p>" + "Food: " + results[i].food + "</p>" 
							+ "<p>" + "Created at: " + results[i].created_at + "</p>" 
							+ "<p>" + "Start Time:" + results[i].beginning + "</p>" 
							+ "<p>" + "Expiration: " + results[i].expiration + "</p>" + "<br>" + "<br>";	
						}
					}
					indexPage += "</body></html>";
					response.send(indexPage);
				}
				else {
					response.send('<!DOCTYPE HTML><html><head><title>Error</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
				}
			});
		}
	});
});


app.get('/', function(request, response) {
	

});



app.get('/events', function(request, response) {
	//response.render('pages/index');
	db.collection('events', function(error, collection) {
		if (!error) {
			collection.find().toArray(function(error, results) {
				if (!error) {
					response.send(JSON.stringify({"events": results}));
				}
				else {
					response.send(JSON.stringify({"error":"Whoops, something is wrong with your data!"}));
				}
			});
		}
	});
});


app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
