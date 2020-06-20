var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/example';
var ObjectID = require('mongodb').ObjectID;

var db;

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }
    // mongodb 버전 3.0이상을 사용할 때는, connection을 할 때에 database명을 명시해야함
    db = database.db('example');
});

class Coffee {}

// Login(로그인)
Coffee.showLogin = async (user) => {
    return await db.collection('user').findOne({ registerId: user.loginId, registerPw: user.loginPw });
}

// Register (회원 가입 및 중복방지)
Coffee.addRegister = async (registerId, registerPw, registerName, registerEmail) => {
    // 회원가입 중복 방지 (조회 후 id가 같으면 가입 안됨)
    const user = await db.collection('user').findOne({ registerId: registerId });
    if(user) { //user 가 있으면 가입이 안됨
        return null;
    }

    // 회원 가입 기능
    const data = { registerId, registerPw, registerName, registerEmail };
    try {
        const returnValue = await userOneAdd(data);
        return returnValue;
    } catch (error) {
        console.error(error);
    }
}

// Register (회원 가입 : 실제 입력된 값 db에 추가)
async function userOneAdd(user) {
    try {
        let userData = await db.collection('user').insertOne({
            registerId: user.registerId,
            registerPw: user.registerPw,
            registerName: user.registerName,
            registerEmail: user.registerEmail
        }, { logging: false });
        const newUser = userData;
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

// Read (전체 조회)
Coffee.getCoffeeList = async () => {
    return await db.collection('coffee').find({}).toArray();
}

// Read Detail (id값 별 상세 조회)
Coffee.getCoffeeDetail = async (Coffeeid) => {
    return await db.collection('coffee').findOne({ _id: new ObjectID(Coffeeid) });
}

// Add (커피 추가)
Coffee.addCoffee = async (name, volume, calorie, caffeine) => {
    const data = { name, volume, calorie, caffeine };
    try {
        const returnValue = await dataOneAdd(data);
        return returnValue;
    } catch (error) {
        console.error(error);
    }
}

// Add : 실제 입력된 값(커피 추가폼) db에 추가
async function dataOneAdd(coffee) {
    try {
        let coffeeData = await db.collection('coffee').insertOne({
            name: coffee.name,
            volume: coffee.volume,
            calorie: coffee.calorie,
            caffeine: coffee.caffeine
        }, { logging: false });
        const newCoffee = coffeeData;
        console.log('입력된 데이터 : ', newCoffee);
        return newCoffee;
    } catch (error) {
        console.log(error);
    }
}

// Delete (커피 삭제)
Coffee.deleteCoffee = async (Coffeeid) => {
    try {
        let result = await db.collection('coffee').deleteOne({ _id: new ObjectID(Coffeeid) });
        console.log('삭제한 id : ', _id);
    } catch (error) {
        console.log(error);
    }
}

// Update (커피 수정)
Coffee.updateCoffee = async (Coffeeid, name, volume, calorie, caffeine) => {
    try {
        let ret = await db.collection('coffee').updateOne({_id: new ObjectID(Coffeeid)}, {$set : {name: name, volume: volume, calorie: calorie, caffeine: caffeine}});
        console.log('ret 값 : ', ret);
        return ret;
    } catch (error) {
        console.log(error);
    }
}

module.exports = Coffee;