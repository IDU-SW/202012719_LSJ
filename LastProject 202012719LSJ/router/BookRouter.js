const express = require('express');
const session = require('express-session'); //login을 위한 session 사용
const router = express.Router();
const coffee = require('../model/CoffeeModel');

router.get('/login', showLogin); //로그인 페이지 보여짐
router.get('/register', showRegister); //회원가입 페이지 보여짐
router.get('/coffee', showCoffeeList);
router.get('/coffee/add', addCoffeeForm);
router.get('/coffee/update/:Coffeeid', updateCoffeeForm);
router.get('/coffee/:Coffeeid', showCoffeeDetail);
router.get('/logout', logout);
router.post('/register', addRegister); // 회원가입 기능 구현
router.post('/login', sessionLogin); //로그인 기능 구현
router.post('/coffee', addCoffee);
router.post('/coffee/delete/:Coffeeid', deleteCoffee);
router.post('/coffee/update/:Coffeeid', updateCoffee);

module.exports = router;

// login (로그인 페이지 보여줌)
async function showLogin(req, res) {
    res.render('login');
}

// login (로그인 기능 구현)
async function sessionLogin(req, res) {
    const user = {
        loginId : req.body.loginId, // login page의 id 접근
        loginPw : req.body.loginPw // login page의 pw 접근
    };
    const result = await coffee.showLogin(user);
    
    if(!result) {
        res.redirect('/login');
    }
    else {
        req.session.user = result;
        res.redirect('/coffee');
    }
}

// logout (로그아웃 기능 구현)
async function logout(req, res) {
    req.session.user = null; //logout 하면 session 에 담긴 login 정보를 비움
    res.redirect('/');
}

// Register (회원가입 페이지를 보여줌)
async function showRegister(req, res) {
    res.render('register');
}

// Register (회원가입 기능)
async function addRegister(req, res) {
    const registerId = req.body.registerId; // 필수 입력값 ID
    const registerPw = req.body.registerPw; // 필수 입력값 PW
    const registerName = req.body.registerName;
    const registerEmail = req.body.registerEmail;

    if (!registerId || !registerPw) {
        res.status(400).send({ error: 'ID 와 PW 입력은 필수입니다.' });
        return;
    }

    try {
        const result = await coffee.addRegister(registerId, registerPw, registerName, registerEmail);
        console.log(result);
        if(result == null) { //회원 가입 id가 중복되면 회원가입 실패 페이지 띄우기
            res.render('registerFail');
        }
        else {
            res.render('registerComplete', { data: result }); //회원가입이 정상적으로 되면 완료페이지 띄우기
        }
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Read (리스트조회)
async function showCoffeeList(req, res) {
    const CoffeeList = await coffee.getCoffeeList();
    console.log(CoffeeList);
    res.render('Coffee', { coffee: CoffeeList, count: CoffeeList.length })
}


// ReadDetail (리스트 상세조회)
async function showCoffeeDetail(req, res) {
    try {
        const Coffeeid = req.params.Coffeeid;
        console.log('Coffeeid : ', Coffeeid);
        const info = await coffee.getCoffeeDetail(Coffeeid);
        res.render('CoffeeDetail', { data: info });
    }
    catch (error) {
        console.log('Can not Coffee find, 404');
        res.status(error.code).send({ msg: error.msg });
    }
}

// Add (커피 추가)
async function addCoffee(req, res) {
    const name = req.body.name;

    if (!name) {
        res.status(400).send({ error: 'name 에 입력된 값이 존재하지 않습니다.' });
        return;
    }

    const volume = req.body.volume;
    const calorie = parseInt(req.body.calorie);
    const caffeine = req.body.caffeine;

    try {
        const result = await coffee.addCoffee(name, volume, calorie, caffeine);
        res.render('CoffeeAddComplete', { data: result });

        console.log('커피 이름 : ' + name);
        console.log('커피 용량 : ' + volume);
        console.log('커피 칼로리 : ' + calorie);
        console.log('커피 카페인 양 : ' + caffeine);
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Add Form (커피 추가 폼)
function addCoffeeForm(req, res) {
    res.render('CoffeeAdd');
}

// Delete (커피 삭제)
async function deleteCoffee(req, res) {
    try {
        const Coffeeid = req.params.Coffeeid;
        const result = await coffee.deleteCoffee(Coffeeid);
        res.render('CoffeeDelete', { data: result })
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Update (커피 수정)
async function updateCoffee(req, res) {
    const Coffeeid = req.params.Coffeeid;
    const name = req.body.name;

    if (!name) {
        res.status(400).send({ error: 'name 에 입력된 값이 존재하지 않습니다.' });
        return;
    }

    const volume = req.body.volume;
    const calorie = parseInt(req.body.calorie);
    const caffeine = req.body.caffeine;

    try {
        const result = await coffee.updateCoffee(Coffeeid, name, volume, calorie, caffeine);
        res.render('CoffeeUpdateComplete', { data: result });
    }
    catch (error) {
        res.status(500).send(error.msg);
    }
}

// Update Form
async function updateCoffeeForm(req, res) {
    try {
        const Coffeeid = req.params.Coffeeid;
        console.log('Coffeeid : ', Coffeeid);
        const info = await coffee.getCoffeeDetail(Coffeeid);
        res.render('CoffeeUpdate', { data: info });
    }
    catch (error) {
        console.log('Can not find, 404');
        res.status(error.code).send({ msg: error.msg });
    }
}
