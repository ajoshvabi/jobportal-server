// // app.js
// const express = require('express');
// const app = express();
// const port = process.env.PORT || 5000;
// require("dotenv").config();
// const mongoose = require('mongoose');
// const cors =require('cors');
// // app.options('*', cors()) 
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);

// // const mongoose = require('mongoose');
// // const ObjectId = mongoose.Types.ObjectId;


// const apiData =  require('./routes/userController')
// const jobData= require('./routes/jobController')
// const hrData= require('./routes/hrController')

// mongoose.connect(process.env.MONGODB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// var store = new MongoDBStore({
//   uri: process.env.MONGODB_URL,
//   collection: 'mySessions'
// });


// // app.use(bodyParser.json());
// // app.use(
// //   cors({
// //     origin: 'https://aj-job.netlify.app',
// //     credentials: true,
// //   })
// // );

// app.use(cors({
//   origin: ['https://aj-job.netlify.app','https://ajjob.vercel.app'],
//   methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));




// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// app.use(session({
//   secret:'893d64c310bcfdc2bd00e8a723b7c2b097f7d11d4963aae24dcefb3aac2dc9e081d87128e5761960b500cc0f1c02b97b89fb297184976c41b62c04ae60e1dc5c',
//   resave:false,
//   saveUninitialized: true,
//   cookie: { secure: true },
//   store: store
// }));
// app.set("trust proxy", 1);

// app.use(express.json());


// app.use('/',apiData);
// app.use('/',jobData);
// app.use('/',hrData);


// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });






// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     if (origin && origin === 'https://aj-job.netlify.app') {
// //       callback(null, true);
// //     } else {
// //       callback(new Error('Not allowed by CORS'));
// //     }
// //   },
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PATCH'],
// // };



const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a new MongoDB session store
var store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'mySessions'
});

// Enable CORS middleware
app.use(cors({
  origin: ['https://aj-job.netlify.app', 'https://ajjob.vercel.app','http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming request bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Set up session management
app.use(session({
  secret: '893d64c310bcfdc2bd00e8a723b7c2b097f7d11d4963aae24dcefb3aac2dc9e081d87128e5761960b500cc0f1c02b97b89fb297184976c41b62c04ae60e1dc5c',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: store
}));
app.set("trust proxy", 1);

// Parse JSON bodies
app.use(express.json());

// Define your routes
const apiData = require('./routes/userController');
const jobData = require('./routes/jobController');
const hrData = require('./routes/hrController');

// Route handlers
app.use('/', apiData);
app.use('/', jobData);
app.use('/', hrData);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
