var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose   = require('mongoose');
var passport = require('passport');

var passportConfig = require('./lib/passport-config');


var index = require('./routes/index');
var users = require('./routes/users');
var contests = require('./routes/contests');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// Pug의 local에 moment라이브러리와 querystring 라이브러리를 사용할 수 있도록.
app.locals.moment = require('moment');
app.locals.querystring = require('querystring');

//=======================================================
// mongodb connect
//=======================================================
mongoose.Promise = global.Promise; // ES6 Native Promise를 mongoose에서 사용한다.
// const connStr = 'mongodb://localhost/yrdb2';
// 아래는 mLab을 사용하는 경우의 예: 본인의 접속 String으로 바꾸세요.
const connStr = (process.env.NODE_ENV == 'production')? 
  'mongodb://yurim:dbfla1216@ds263791.mlab.com:63791/yurim':
  'mongodb://localhost/mjdb3';
//mongoose.set('useCreateIndex', true)
mongoose.connect(connStr, { useNewUrlParser: true })
// mongoose.connect(connStr, {useMongoClient: true});
mongoose.connection.on('error', console.error);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  debug: true,
  sourceMap: true
}));

// session을 사용할 수 있도록.
app.use(session({
  name: 'mjoverflow',
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));

app.use(flash()); // flash message를 사용할 수 있도록

app.use(express.static(path.join(__dirname, 'public')));

//=======================================================
// Passport 초기화
//=======================================================
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// pug의 local에 현재 사용자 정보와 flash 메시지를 전달하자.
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;  // passport는 req.user로 user정보 전달
  res.locals.flashMessages = req.flash();
  next();
});

//Route
app.use('/', index);
app.use('/users', users);
app.use('/contests', contests);
require('./routes/auth')(app, passport);
app.use('/api', require('./routes/api'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
