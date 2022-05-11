const express = require("express");
const router = express.Router();
module.exports = router;
const fs = require("fs");

function writeJSON(url, id, success, fail) {
    fs.readFile(url, function (err, data) {
        if (err) {
            fail && fail({code: 400, msg: "读取数据失败", data: err});
            return console.error(err, "\n----删除失败----");
        }
        data = JSON.parse(data.toString());
        var hasMatchData = false;
        var arr = data.data;
        for (var i = 0, len = arr.length; i < len; i++) {
            var a = arr[i];
            if (a.id == id) {
                arr.splice(i, 1);//删除数据
                data.total = arr.length;
                hasMatchData = true;
                break;
            }
        }
        if (!hasMatchData) {
            fail && fail({code: 412, msg: "没有找到对应id的记录，删除失败", data: data});
            return console.error("\n----删除失败----");
        }
        fs.writeFile(url, JSON.stringify(data), function (err) {
            if (err) {
                fail && fail({code: 420, msg: "写入数据失败", data: err});
                return console.error(err, "\n----删除失败----");
            }
            success && success(data);
            console.log(data, `\n----id:${id}删除成功----`);
        });
    });
}

//删除数据（all方法支持POST、GET、PUT、PATCH、DELETE传参方式）
router.all("/delete", (req, res) => {
    const id = req.body.id || req.query.id;
    if (!id) return res.json({code: 410, status: "FAIL", message: "缺少id字段", data: id});
    writeJSON("json/data.json", id, (data) => res.json({code: 200, status: "SUCCESS", message: "删除成功", data: data}), (err) => res.json({code: err.code || 400, status: "FAIL", message: err.msg || "删除失败", data: err.data}));
});