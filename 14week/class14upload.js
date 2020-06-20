const express = require('express');
const app = express();
let multer = require('multer')
let AWS = require("aws-sdk")
let path = require("path")
var Sequelize = require('sequelize')

AWS.config.loadFromPath(__dirname + "/aws_config.json")
let s3 = new AWS.S3()
let multerS3 = require("multer-s3")

const sequelize = new Sequelize('example', 'admin', 'cometrue', { dialect: 'mysql', host: 'idu-2020.cnmqjaiiofsi.ap-northeast-2.rds.amazonaws.com' });

const Image = sequelize.define('image', {
    name: Sequelize.STRING,
    url: Sequelize.STRING,
}, { timestamps: false })

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "idu-2020-0019/upload",
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname)
            cb(null, Date.now().toString() + extension)
        },
        acl: 'public-read-write',
        location: "/test"
    })
})

// 템플릿 엔진 설정(필수)
app.set('view engine', 'ejs');
// 템플릿 파일 위치 설정(필수)
app.set('views', __dirname + '/views');

app.get("/", (req, res) => {
    list().then((ret) => {
        console.log(ret)
        res.render('FileUpload', { data: ret })
    })
})

app.post("/upload", upload.single('uploadfile'), async (req, res, next) => {

    var image = {
        name: req.file.key,
        url: req.file.location
    }
    let ret = await Image.create(image)

    if (ret) console.log("저장성공")
    else console.log("저장실패")

    res.redirect('/')
})

async function list() {
    return await Image.findAll({ raw: true })
}

app.listen(3000, () => {
    console.log("Server run")
    Image.sync()
})