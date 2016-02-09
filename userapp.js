var express = require('express')
var app = express();
var path = require('path'); //joins the path names, useful. 
var bodyParser = require('body-parser');
var fs = require('fs');

var userArray = [];

fs.readFile("users.json", function(err, contents) { //initial reading of user file
	if (err) {
		throw err;
	};
	userArray = JSON.parse(contents); //parses the user file to a javascript object
	//console.log(userArray);
});

app.set('views', path.join(__dirname, 'views')); //set the views folder where the jade file resides
app.set('view engine', 'jade'); //sets the jade rendering
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));


// essentially GET is used to retrieve remote data, 
// and POST is used to insert/update remote data.

app.get('/', function(req, res) {
	res.send('Hello World!');
});


app.get('/users', function(req, res) { //sets up new route for users page
	res.render('index', {
		userList: userArray
	});
	//request that the view engine renders this page
	// also passes the userArray (labelled as userList for Jade usage)
});

app.get('/form', function(req, res) { // new route for the user form page
	res.render('form');
});

app.get('/search2', function(req, res) { // ALPHA SEARCH ROUTE 
	res.render('search2');
});


app.post('/result', function(req, res) { //post to deal with the data from the form page. 
	firstQuery = req.body.firstname;
	secondQuery = req.body.lastname;

	// MAKE A NOTE TO CHANGE THIS TO "INCLUDES" INSTEAD OF MATCHING "EXACT" VALUES 

	for (i = 0; i < userArray.length; i++) { //iterate through user array
		if (userArray[i].firstname == firstQuery) { //if array property first name matches  the first query (firstname) from the form
			var returnedName = userArray[i].firstname + " " + userArray[i].lastname; // set new variable to matching user. 
			break //escape the loop once found
		} else if (userArray[i].lastname == secondQuery) {
			var returnedName = userArray[i].firstname + " " + userArray[i].lastname; // same as above but lastname matches. 
			break // escape the loop once found
		} else {
			var returnedName = "No users found"; // if no matching users are found return this string
		}
	}
	
res.render('results', {reZult: returnedName}) //renders the results page with matching user object and passes the object to results page.
});

app.get('/newusers', function(req, res) { // new route for the new user creation form page
	res.render('newusers');
});

app.post('/adduser',function(req, res) { //new route for the to deal with the data from the new user form
	var booUser = {}; //empty object

	booUser.firstname = req.body.firstname; //set the first name property of the object to match the input from the form
	booUser.lastname = req.body.lastname; // same as above
	booUser.email = req.body.email; // same as above
    userArray.push(booUser); // push this new object to the userArray 

   var jsonUser = JSON.stringify(userArray); //turn back into json to write back to original json file.


fs.writeFile("users.json", jsonUser, function(err, contents) { //for each post from new user, add the new user back to the json file also.
	if (err) {
		throw err;
	};

    console.log(userArray); //print to test it's added

    res.redirect('/users'); //will refresh to user listing page. 

});
});

app.post('/autocomplete',function(req,res) {
	console.log("might be working")
	fauto = req.body.bar //takes the body from the search form in search2
	console.log(fauto)
	for (i = 0; i < userArray.length; i++) {
		if (userArray[i].firstname[0] == fauto) {
			var booty = userArray[i].firstname + " " + userArray[i].lastname;
			break //transforms the first letter into a matching user
		}
		else var booty = fauto //if no matches, remains the initial input.
	}
		res.send(booty); //replaces the input search bar with autocompleted user. 
});




app.listen(3000);