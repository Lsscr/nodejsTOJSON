const express = require("express");
const router = express.Router();
module.exports = router;
const fs = require("fs");

function writeJSON(url, params, success, fail) {
    var id = params.id;
    delete  params.id;
    fs.readFile(url, function (err, data) {
        if (err) {
            fail && fail({code: 400, msg: "读取数据失败", data: err});
            return console.error(err, "\n----修改失败----");
        }
        data = JSON.parse(data.toString());
        var hasMatchData = false;
        var arr = data.data;
        for (var i = 0, len = arr.length; i < len; i++) {
            var a = arr[i];
            if (a.id == id) {
                for (var key in params) a[key] = params[key];
                hasMatchData = true;
                break;
            }
        }
        if (!hasMatchData) {
            fail && fail({code: 412, msg: "没有找到对应id的记录，修改失败", data: data});
            return console.error( "\n----修改失败----");
        }
        fs.writeFile(url, JSON.stringify(data), function (err) {
            if (err) {
                fail && fail({code: 420, msg: "写入数据失败", data: err});
                return console.error(err, "\n----修改失败----");
            }
            success && success(data);
            console.log(data,`\n----id:${id}修改成功----`);
        });
    });
}

//修改数据（all方法支持POST、GET、PUT、PATCH、DELETE传参方式）
router.all("/update", (req, res) => {
    const id = req.body.id || req.query.id;
    const name = req.body.name || req.query.name;
    const tel = req.body.tel || req.query.tel;
    var params = {};
    id && (params.id = id);
    name && (params.name = name);
    tel && (params.tel = tel);
    if (!params.id) return res.json({code: 410, status: "FAIL", message: "缺少id字段", data: params});
    if (params.tel && params.tel.toString().length !== 11) return res.json({code: 411, status: "FAIL", message: "请输入正确的手机号", data: params});
    writeJSON("json/data.json", params, (data) => res.json({code: 200, status: "SUCCESS", message: "修改成功", data: data}), (err) => res.json({code: err.code || 400, status: "FAIL", message: err.msg || "修改失败", data: err.data}));
});