/******/ "use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/Drag.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Drag = /** @class */ (function () {
    function Drag(element, dConfig) {
        if (dConfig === void 0) { dConfig = {}; }
        dConfig = this.InitParams(dConfig);
        this.element = element;
        this.screenWidth = window.innerWidth || window.outerWidth || 0;
        this.screenHeight = window.innerHeight || window.outerHeight || 0;
        this.elementWidth = this.element.offsetWidth || 0;
        this.elementHeight = this.element.offsetHeight || 0;
        this.isPhone = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
        this.element.style.position = 'absolute';
        this.elementX = 0;
        this.elementY = 0;
        this.elementOffsetX = 0;
        this.elementOffsetY = 0;
        this.moving = false;
        this.autoAdsorbent = dConfig.autoAdsorbent;
        this.hideOffset = this.elementWidth * dConfig.hideOffset;
        if (!this.isPhone) {
            console.error('警告！！当前插件版本只兼容移动端');
        }
        // 默认位置
        this.setElementPosition(dConfig.defaultPosition.x, dConfig.defaultPosition.y);
        this.watchTouch();
    }
    Drag.prototype.InitParams = function (dConfig) {
        // 处理下Options未配置的参数
        return {
            autoAdsorbent: dConfig.autoAdsorbent || false,
            hideOffset: dConfig.hideOffset || 0,
            defaultPosition: dConfig.defaultPosition || { x: 0, y: 0 },
        };
    };
    Drag.prototype.watchTouch = function () {
        var _this = this;
        this.element.addEventListener('touchstart', function (event) {
            var rect = event.target.getBoundingClientRect();
            // 页面被卷去的高度
            // 不兼容IE
            var docScrollTop = document.documentElement.scrollTop;
            _this.elementOffsetX = event.targetTouches[0].pageX - rect.left;
            _this.elementOffsetY = event.targetTouches[0].pageY - rect.top - docScrollTop;
            _this.moving = true;
            _this.element.addEventListener('touchmove', _this.move.bind(_this), { passive: false });
        });
        window.addEventListener('touchend', function () {
            _this.moving = false;
            document.removeEventListener('touchmove', _this.move);
            if (_this.autoAdsorbent)
                _this.adsorbent();
        });
    };
    Drag.prototype.setElementPosition = function (x, y) {
        // 溢出处理
        // 溢出范围
        // 但页面超出屏幕范围，计算当前屏幕范围
        var _a, _b, _c, _d;
        var leftScope = this.moving ? 0 : 0 - this.hideOffset;
        // 当前屏幕right最大值
        var rs = this.screenWidth - this.elementWidth;
        var rightScope = this.moving ? rs : rs + this.hideOffset;
        var bottomScope = this.screenHeight - this.elementHeight;
        if (x <= leftScope && y <= 0) {
            _a = [leftScope, 0], x = _a[0], y = _a[1];
        }
        else if (x >= rightScope && y <= 0) {
            _b = [rightScope, 0], x = _b[0], y = _b[1];
        }
        else if (x <= leftScope && y >= bottomScope) {
            _c = [leftScope, bottomScope], x = _c[0], y = _c[1];
        }
        else if (x >= rightScope && y >= bottomScope) {
            _d = [rightScope, bottomScope], x = _d[0], y = _d[1];
        }
        else if (x > rightScope) {
            x = rightScope;
        }
        else if (y > bottomScope) {
            y = bottomScope;
        }
        else if (x <= leftScope) {
            x = leftScope;
        }
        else if (y <= 0) {
            y = 0;
        }
        this.elementX = x;
        this.elementY = y;
        this.element.style.top = y + "px";
        this.element.style.left = x + "px";
    };
    Drag.prototype.move = function (event) {
        event.preventDefault();
        if (!this.moving)
            return;
        this.elementY = (event.touches[0].pageX - this.elementOffsetX);
        this.elementX = (event.touches[0].pageY - this.elementOffsetY);
        var ex = (event.touches[0].pageX - this.elementOffsetX);
        var ey = (event.touches[0].pageY - this.elementOffsetY);
        this.setElementPosition(ex, ey);
    };
    Drag.prototype.animate = function (targetLeft, spd) {
        var _this = this;
        var timer = setInterval(function () {
            var step = (targetLeft - _this.elementX) / 10;
            // 对步长进行二次加工(大于0向上取整,小于0向下取整)
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            // 动画原理： 目标位置 = 当前位置 + 步长
            var x = _this.elementX + step;
            _this.setElementPosition(x, _this.elementY);
            // 检测缓动动画有没有停止
            if (Math.abs(targetLeft - _this.elementX) <= Math.abs(step)) {
                // 处理小数赋值
                var xt = targetLeft;
                _this.setElementPosition(xt, _this.elementY);
                clearInterval(timer);
            }
        }, spd);
    };
    Drag.prototype.adsorbent = function () {
        // 判断吸附方向
        // 屏幕中心点
        var screenCenterY = Math.round(this.screenWidth / 2);
        // left 最大值
        var rightScope = this.screenWidth - this.elementWidth;
        // 根据中心点来判断吸附方向
        if (this.elementX < screenCenterY) {
            this.animate(0 - (this.hideOffset), 10);
        }
        else {
            this.animate(rightScope + (this.hideOffset), 10);
        }
    };
    return Drag;
}());
exports.default = Drag;

})();

var __webpack_exports___esModule = __webpack_exports__.__esModule;
var __webpack_exports__default = __webpack_exports__.default;
export { __webpack_exports___esModule as __esModule, __webpack_exports__default as default };

//# sourceMappingURL=Drag.js.map