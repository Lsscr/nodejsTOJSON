const express = require("express");
const router = express.Router();
module.exports = router;
const fs = require("fs");

function isMatch(record, obj) {
    var countDefault = 0;
    var countMatch = 0;
    for (var key in obj) {
        countDefault++;
        var value = obj[key];
        record[key] == value && (countMatch++);
    }
    return countDefault === countMatch;
}

function readJSON(url, params, success, fail) {
    var pageNum = parseInt(params.pageNum || 0);//默认从第1页开始
    pageNum < 0 && (pageNum = 0);
    var pageSize = parseInt(params.pageSize || 0);//不传参就显示所有数据
    pageSize < 0 && (pageSize = 10);
    delete  params.pageNum;
    delete  params.pageSize;
    fs.readFile(url, function (err, data) {
        if (err) {
            fail && fail({code: 400, msg: "读取数据失败", data: err});
            return console.error(err, "\n----查询失败----");
        }
        data = JSON.parse(data.toString());
        var re = [];
        var arr = data.data;
        for (var i = 0, len = arr.length; i < len; i++) {
            var a = arr[i];
            isMatch(a, params) && re.push(a);
        }
        re = re.slice(pageNum * pageSize, pageSize ? (pageNum + 1) * pageSize : re.length);
        success && success({data: re, total: re.length, pageNum: pageNum, pageSize: pageSize});
        console.log(re, "\n----查询成功----");
    });
}

//查询数据（all方法支持POST、GET、PUT、PATCH、DELETE传参方式）
router.all("/select", (req, res) => {
    const id = req.body.id || req.query.id;
    const name = req.body.name || req.query.name;
    const tel = req.body.tel || req.query.tel;
    const pageNum = req.body.pageNum || req.query.pageNum;
    const pageSize = req.body.pageSize || req.query.pageSize;
    var params = {};
    id && (params.id = id);
    name && (params.name = name);
    tel && (params.tel = tel);
    pageNum && (params.pageNum = pageNum);
    pageSize && (params.pageSize = pageSize);
    readJSON("json/data.json", params, (data) => res.json({code: 200, status: "SUCCESS", message: "查询成功", data: data}), (err) => res.json({code: err.code || 400, status: "FAIL", message: err.msg || "查询失败", data: err.data}));
});