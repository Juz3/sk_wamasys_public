const express = require('express');
const path = require('path');

// route configurations
const routeFile = require('./routes/routes');

// needed for parsing form data from request body
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Express instance
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// needed for cookie parsing
app.use(cookieParser());

// router in Express
const router = express.Router();

const port = process.env.PORT || 5000;

// Different response headers for production and local
if(process.env.NODE_ENV === 'production') {
  // Router headers
  router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://floating-fortress-36530.herokuapp.com');
  res.header('Access-Control-Allow-Headers', 
  'Content-Type, Cookie, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
  });
  
} else {
  // Router headers
  router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 
  'Content-Type, Cookie, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
  });
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// verify token function
function verifyToken(req, res, next) {
  // log request headers
  //console.log("req headers:", JSON.stringify(req.headers));
  // log cookies
  //console.log("Cookies",req.cookies);
  var bearerHeader = req.cookies['jwtAuth'];

  if(req.cookies['jwtAuth'] === 'undefined' && 
      req.headers['authorization'] !== 'undefined') {
      bearerHeader = req.headers['authorization'];
  }
  // log value of bearerheader
  //console.log('authorization header (Bearer + jwt)', bearerHeader);
  // check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    //console.log("Bearer header found, splitting");
    // Split bearer header at space
    var bearer = bearerHeader.split(' ');
    // get token from array
    var  bearerToken = bearer[1];
    //console.log('TRUE JWT: ', bearerToken);
    //set the token!
    req.token = bearerToken;
    //nextmiddleware
    next();
  } else {
    // token is undefined
    console.log('jwt header err: bearerToken is undefined');
    // then its forbidden
    res.sendStatus(403);
  }
}

// route for user registration
router.post('/register', routeFile.register);

// route for login
router.post('/login', routeFile.login);

// homepage get routes
// *this is a Protected route*
router.get('/home', verifyToken, routeFile.getHome);
router.get('/homeloan', verifyToken, routeFile.getLoan);

// storage get route
// *this is a Protected route*
router.get('/storage', verifyToken, routeFile.getStorage);

// route for adding new items to Storage table
// *this is a Protected route*
router.post('/add', verifyToken, routeFile.addItemToStorage);

// routes for adding new loans
// *this is a Protected route*
router.post('/loan', verifyToken, routeFile.makeLoan);
// *this is a Protected route*
router.post('/loanlist', verifyToken, routeFile.addToLoanList);

// *this is a Protected route*
router.post('/search', verifyToken, routeFile.search);

app.use('/api', router);

// The "catch all requests"-handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port);

console.log(`Server listening on ${port}`);