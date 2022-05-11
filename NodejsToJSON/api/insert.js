const express = require("express");
const router = express.Router();
module.exports = router;
const fs = require("fs");

function writeJSON(url, params, success, fail) {
    fs.readFile(url, function (err, data) {
        if (err) {
            fail && fail({code: 400, msg: "读取数据失败", data: err});
            return console.error(err, "\n----添加失败----");
        }
        data = JSON.parse(data.toString());
        data.data.push(params);
        data.total = data.data.length;
        fs.writeFile(url, JSON.stringify(data), function (err) {
            if (err) {
                fail && fail({code: 420, msg: "写入数据失败", data: err});
                return console.error(err, "\n----添加失败----");
            }
            success && success(data);
            console.log(data, "\n----添加成功----");
        });
    });
}

//添加数据（all方法支持POST、GET、PUT、PATCH、DELETE传参方式）
router.all("/insert", (req, res) => {
    const name = req.body.name || req.query.name;
    const tel = req.body.tel || req.query.tel;
    var params = {id: new Date().getTime(), name: name, tel: tel};
    if (!params.name) return res.json({code: 410, status: "FAIL", message: "缺少姓名字段", data: params});
    if (!params.tel) return res.json({code: 411, status: "FAIL", message: "缺少手机号字段", data: params});
    if (params.tel.toString().length !== 11) return res.json({code: 411, status: "FAIL", message: "手机号格式不正确", data: params});
    writeJSON("json/data.json", params, (data) => res.json({code: 200, status: "SUCCESS", message: "添加成功", data: data}), (err) => res.json({code: err.code || 400, status: "FAIL", message: err.msg || "添加失败", data: err.data}));
});