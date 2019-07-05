"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DragDropSort =
/*#__PURE__*/
function (_Component) {
  _inherits(DragDropSort, _Component);

  function DragDropSort(props) {
    var _this;

    _classCallCheck(this, DragDropSort);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DragDropSort).call(this, props));
    _this.callback = _this.props.callback;
    _this.dragTag = _this.props.dragTag && _this.props.dragTag.toLowerCase();
    return _this;
  }

  _createClass(DragDropSort, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var ele = '#drag-drop';
      this._parent = this.ModifyParent(this.$(ele));
      this.data = [];
      this.enterIdx = null;
      this.targetIdx = null;
      this.enterObj = Object.create(null);
      this.targetObj = Object.create(null);
      this.childTagName = this._parent.firstElementChild && this._parent.firstElementChild.tagName.toLowerCase();
      this.AddAttr(this._parent);
      this.BindEvent();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      this.AddAttr(this._parent);
    }
  }, {
    key: "$",
    value: function $(dom, selector, isAll) {
      if (typeof dom === 'string') {
        isAll = selector == true;
        selector = dom;
        dom = undefined;
      }

      dom = dom || document;
      return isAll ? dom.querySelectorAll(selector) : dom.querySelector(selector);
    } // bind the event with the drag-drop dom.

  }, {
    key: "BindEvent",
    value: function BindEvent() {
      var _this2 = this;

      var that = this;

      that._parent.addEventListener('drag', function (e) {}); // when the drap start, emit the event.


      that._parent.addEventListener('dragstart', function (e) {
        var target = that.FindParent(that._parent, e.target);
        that.targetObj = target; // compatible the firefox browser.

        if (/Firefox/.test(navigator.userAgent)) {
          e.dataTransfer.setData('Text', target);
        }

        that.$(that._parent, that.childTagName, true).forEach(function (dom, idx) {
          if (dom == target) {
            that.targetIdx = idx;
          }
        });
        target.style.opacity = .5;
      }); // when the drap end, remove the style.


      that._parent.addEventListener('dragend', function (e) {
        e.target.style.opacity = '';

        that._parent.childNodes.forEach(function (node) {
          node.removeAttribute('style');
        });
      });

      that._parent.addEventListener('dragenter', function (e) {
        e.preventDefault();
        that.enterObj = that.FindParent(that._parent, e.target); // the enter Object must is the children of _parent.

        if (that.enterObj != undefined) {
          that.$(that._parent, that.childTagName, true).forEach(function (dom, idx) {
            if (dom == that.enterObj) {
              that.enterIdx = idx;
            }

            ;
          });

          that._parent.childNodes.forEach(function (node) {
            node.removeAttribute('style');
          });

          if (that.targetIdx < that.enterIdx) {
            that.enterObj.style.borderRight = '2px dashed #1890ff';
          } else if (that.targetIdx > that.enterIdx) {
            that.enterObj.style.borderLeft = '2px dashed #1890ff';
          }
        }
      });

      that._parent.addEventListener("dragover", function (e) {
        e.preventDefault();
      }, false);

      document.addEventListener("dragexit", function (e) {
        e.preventDefault();
      }, false);

      that._parent.addEventListener('dragleave', function (e) {
        e.preventDefault();
      });

      that._parent.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var _parent = that._parent,
            targetObj = that.targetObj,
            targetIdx = that.targetIdx,
            enterObj = that.enterObj,
            enterIdx = that.enterIdx,
            FindParent = that.FindParent,
            callback = that.callback;
        var tar = FindParent(_parent, e.target);

        if (tar != undefined && enterObj != undefined && tar.parentNode == _parent) {
          // compatible the Edge browser.
          if (targetIdx < enterIdx) {
            if (/Edge/.test(navigator.userAgent)) {
              _parent.insertBefore(_parent.childNodes[targetIdx], _parent.childNodes[enterIdx + 1]);
            } else {
              targetObj.remove();
              enterObj.after(targetObj);
            }
          } else if (targetIdx > enterIdx) {
            if (/Edge/.test(navigator.userAgent)) {
              _parent.insertBefore(targetObj, enterObj);
            } else {
              targetObj.remove();
              enterObj.before(targetObj);
            }
          } // process sorted data.


          var rstData = [];

          _parent.childNodes.forEach(function (node) {
            node.removeAttribute('style');
            var label = node.textContent;
            rstData = rstData.concat(_this2.props.data.filter(function (item) {
              return item.label === label;
            }));
          });

          callback(rstData);
        }
      });
    }
    /**
     * Look up the parent element and keep finding the target parent element.
     */

  }, {
    key: "FindParent",
    value: function FindParent(targetPar, target) {
      if (targetPar == target) {
        for (var i = 0; i < targetPar.length; i++) {
          if (this.enterIdx == i) {
            target = item;
          }
        }

        return target;
      }

      while (target.parentNode != targetPar) {
        target = target.parentNode;
        if (target == null || target == undefined) break;
      }

      return target;
    } // Modify the parent object to be the parent of the dragTag.

  }, {
    key: "ModifyParent",
    value: function ModifyParent(_parent) {
      var parent = _parent;

      try {
        while (parent.firstElementChild && this.dragTag != parent.firstElementChild.tagName.toLowerCase()) {
          parent = parent.firstElementChild;

          if (parent.firstElementChild == null) {
            parent = _parent;
            break;
          }

          ;
        }
      } catch (e) {
        throw 'The dragTag doesn\'t exist, please enter correct tag.';
      }

      return parent;
    } // Add the property dragable to all child elements.

  }, {
    key: "AddAttr",
    value: function AddAttr(domEle) {
      var that = this;
      var childTagName = domEle.firstElementChild && domEle.firstElementChild.tagName.toLowerCase();
      var childrens = Array.prototype.slice.call(that.$(domEle, childTagName, true));

      if (_instanceof(childrens, Array)) {
        childrens.forEach(function (child) {
          child.setAttribute('draggable', true);

          if (child.firstElementChild != null) {
            that.AddAttr(child);
          }
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        id: "drag-drop"
      }, _react.default.Children.map(this.props.children, function (child) {
        return child;
      }));
    }
  }]);

  return DragDropSort;
}(_react.Component);

exports["default"] = DragDropSort;

module.exports = exports["default"]