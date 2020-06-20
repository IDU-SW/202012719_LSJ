const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret : 'Secret Key',
    resave : false,
    saveUninitialized : false
}));

app.use(gone); // 로그인이 안됬을 때(다른 페이지 못감) 로그인 페이지로 표시

function gone(req, res, next) {
    if(req.session.user) {
        res.locals.user = req.session.user; //로그인 확인용
    }
    console.log(req.path);
    switch(req.path) {
        case '/login': //로그인이 안되더라도 로그인 기능 접근 가능
        case '/register' : //로그인이 안되더라도 회원가입 기능 접근 가능
        case '/favicon.ico' : //파비콘 무시
        next();
        break;
        default :
            if(!req.session.user) { //로그인이 안됬으면
                res.render('login') //로그인 페이지 띄우기
            }
            else next();
            break;
    }
}

app.set('view engine', 'ejs'); //뷰 엔진 ejs 사용
app.set('views', __dirname + '/view')

const CoffeeRouter = require('./router/CoffeeRouter');
app.use(CoffeeRouter);

module.exports = app;