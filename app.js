const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')(session);

// Load configuration file
dotenv.config({path:'./config/config.env'});

//Passport config
require('./config/passport')(passport);

//connect DB
connectDB();

const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json());

//Specify logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Method Override
app.use(methodOverride('_method'));

// Helpers
const { formatDate,stripTags,truncate,editIcon,select } = require('./helpers/hbs');

// Handle bars set
app.engine('.hbs', exphbs({helpers:{formatDate,select,editIcon, stripTags,truncate },extname:'.hbs', defaultLayout:'main'}));
app.set('view engine', '.hbs');

//session middleware
app.use(session({
	secret:'secret',
	resave:false,
	saveUnitialized:true,
	store: new MongoStore({mongooseConnection: mongoose.connection})

}));

// set passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static files
app.use(express.static(path.join(__dirname, 'public')));

// Global user 
app.use(function(req,res,next) {
	res.locals.user = req.user || null;
	next();
});

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/newStories'))

const PORT = 8000;


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))