'use strict';

/*
 /* JavaScript Document
 /* Author
 /* Company : Company
 /* Versions : 1.1.1
 */

function Tinyer() {

    var _this = this;

    var param = {
        title: '',
        text: '',
        callback: function callback() {
            //console.log('点击了确定按钮');
        }
    };

    var list = '<div class="tinyer-popup">' + '<div class="tinyer-popup-inner">' + '<div class="tinyer-popup-title">#title#</div>' + '<div class="tinyer-popup-text">#text#</div>' + '#promptBox#</div>' + '<div class="tinyer-popup-buttons">#btnCancel#' + '<span class="tinyer-popup-button tinyer-popup-button-bold">确定</span>' + '</div>' + '</div><div class="tinyer-popup-backdrop"></div>';

    //设置参数默认值
    var paramdef = function paramdef(title, text, callback) {
        if (typeof title === "string") {
            param.title = title;
        }
        if (typeof text === "string") {
            param.text = text;
        }
        if (typeof callback === "function") {
            param.callback = callback;
        }
    };

    _this.alert = function (title, text, callback) {
        paramdef(title, text, callback);
        //定时消失弹出层
        if (typeof text === "undefined" && typeof callback === "undefined") {
            $("body").append('<div class="tinyer-toast-container"><div class="tinyer-toast-message">' + param.title + '</div></div>');
            setTimeout(function () {
                $(".tinyer-toast-container").addClass("tinyer-active");
            }, 100);
            setTimeout(function () {
                $(".tinyer-toast-container").removeClass("tinyer-active");
            }, 1800);
            setTimeout(function () {
                $(".tinyer-toast-container").remove();
            }, 2000);
            return;
        }
        var html = list.replace('#title#', param.title).replace('#text#', param.text).replace('#promptBox#', '').replace('#btnCancel#', '');
        $("body").append(html).addClass("hidden");
        setTimeout(function () {
            $(".tinyer-popup-backdrop").addClass("tinyer-active");
            $(".tinyer-popup").addClass("tinyer-popup-in");
        }, 100);
        //点击确定
        $(".tinyer-popup-button").click(function () {
            _this.closeAll();
            param.callback();
        });
    };

    _this.confirm = function (title, text, callback) {
        paramdef(title, text, callback);
        var html = list.replace('#title#', param.title).replace('#text#', param.text).replace('#promptBox#', '').replace('#btnCancel#', '<span class="tinyer-popup-button">取消</span>');
        $("body").append(html).addClass("hidden");
        setTimeout(function () {
            $(".tinyer-popup-backdrop").addClass("tinyer-active");
            $(".tinyer-popup").addClass("tinyer-popup-in");
        }, 100);
        //取消确定
        $(".tinyer-popup-buttons span").click(function () {
            //取消按钮不需要回调
            var n = this.className.indexOf("tinyer-popup-button-bold");
            if (n > -1) {
                param.callback();
            } else {
                _this.closeAll();
            }
        });
    };

    _this.prompt = function (title, content, callback) {
        paramdef(title, '', callback);
        var html = list.replace('#title#', param.title).replace('#text#', param.text).replace('#promptBox#', content).replace('#btnCancel#', '<span class="tinyer-popup-button">取消</span>');
        $("body").append(html).addClass("hidden");
        setTimeout(function () {
            $(".tinyer-popup-backdrop").addClass("tinyer-active");
            $(".tinyer-popup").addClass("tinyer-popup-in");
        }, 100);
        //取消确定
        $(".tinyer-popup-buttons span").click(function () {
            //取消按钮不需要回调
            var n = this.className.indexOf("tinyer-popup-button-bold");
            if (n > -1) {
                param.callback();
            } else {
                _this.closeAll();
            }
        });
    };

    _this.closeAll = function () {
        setTimeout(function () {
            $(".tinyer-popup-backdrop").removeClass("tinyer-active");
            $(".tinyer-popup").removeClass("tinyer-popup-in");
        }, 100);
        setTimeout(function () {
            $(".tinyer-popup,.tinyer-popup-backdrop").remove();
        }, 500);
        $("body").removeClass("hidden");
    };
}
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map
//# sourceMappingURL=tinyer.js.map