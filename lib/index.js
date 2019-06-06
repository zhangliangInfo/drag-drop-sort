import React, { Component } from 'react';

export class DragDropSort extends Component {
  constructor(props) {
    super(props);
    this.callback = this.props.callback;
    // set the state.
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    let ele = '#drag-drop';
    this._parent = this.$(ele);
    this.data = [];
    this.enterIdx = null;
    this.targetIdx = null;
    this.enterObj = Object.create(null);
    this.targetObj = Object.create(null);
    this.childTagName = this._parent.firstElementChild.tagName.toLowerCase();
    this.AddAttr(this._parent);
    this.BindEvent();
  }

  componentDidUpdate() {
    this.callback(this.state.data);
  }

  $(dom, selector, isAll) {
    if(typeof dom === 'string') {
      isAll = (selector == true);
      selector = dom;
      dom = undefined;
    }
    dom = dom || document;
    return isAll ? dom.querySelectorAll(selector) : dom.querySelector(selector);
  }

  // bind the event with the drag-drop dom.
  BindEvent() {
    let that = this;
    that._parent.addEventListener('drag', e => {});

    // when the drap start, emit the event.
    that._parent.addEventListener('dragstart', e => {
      that.targetObj = that.FindParent(that._parent, e.target);
      that.$(that._parent, that.childTagName, true).forEach((dom, idx) => {
        if(dom == that.targetObj) {
          that.targetIdx = idx;
        }
      })
      e.target.style.opacity = .5;
    });

    // when the drap end, remove the style.
    that._parent.addEventListener('dragend', e => {
      e.target.style.opacity = '';
    });

    that._parent.addEventListener('dragenter', e => {
      e.preventDefault();
      that.enterObj = e.target;
      let _enterObj = that.FindParent(that._parent, e.target);

      // the enter Object must is the children of _parent.
      if(_enterObj != undefined && _enterObj.parentNode == that._parent) {
        that.$(that._parent, that.childTagName, true).forEach((dom, idx) => {
          if(dom == _enterObj) {
            that.enterIdx = idx;
          };
        });
        if(that.targetIdx < that.enterIdx) {
          // _enterObj.classList.add('br2');
          _enterObj.style.borderRight = '2px dashed #1890ff'
        } else if(that.targetIdx > that.enterIdx) {
          // _enterObj.classList.add('bl2');
          _enterObj.style.borderLeft = '2px dashed #1890ff';
        }
      }
    });
    
    that._parent.addEventListener("dragover", function (e) {
      e.preventDefault();
    }, false);
  
    document.addEventListener("dragexit", function (e) {
      e.preventDefault();
    }, false);
  
    that._parent.addEventListener('dragleave', e => {
      e.preventDefault();
      let tar = that.FindParent(that._parent, e.target);
      let _tar = that.FindParent(that._parent, that.enterObj);
      // If a child element is entered, it is ignored
      if(tar != undefined && _tar != undefined && _tar != tar) {
        tar.removeAttribute('style');
        tar.classList.remove('bl2');
        tar.classList.remove('br2');
      }
    });
  
    that._parent.addEventListener('drop', e => {
      e.preventDefault();
      let tar = that.FindParent(that._parent, e.target);

      if(tar != undefined && that.enterObj != undefined && tar.parentNode == that._parent) {
        tar.removeAttribute('style');
        tar.classList.remove('bl2');
        tar.classList.remove('br2');
        if(that.targetIdx < that.enterIdx) {
          if(tar.nextSibling == null) {
            that._parent.appendChild(that.targetObj);
          } else {
            that._parent.insertBefore(that.targetObj, tar.nextSibling);
          }
        } else if(that.targetIdx > that.enterIdx) {
          that._parent.insertBefore(that.targetObj, tar);
        }
        // process sorted data.
        let data = [];
        that._parent.childNodes.forEach(node => {
          let name = node.textContent;
          data = data.concat(this.props.data.filter(item => item.name === name));
        });
        that.setState({
          data
        });
      }
    });
  }

  /**
   * Look up the parent element and keep finding the target parent element.
   */
  FindParent(targetPar, target) {
    if(targetPar == target) {
      for(let i = 0; i<targetPar.length; i++) {
        if(this.enterIdx == i) {
          target = item;
        }
      }
      return target;
    }
    while(target.parentNode != targetPar) {
      target = target.parentNode;
    }
    return target;
  }

  // Add the property dragable to all child elements.
  AddAttr(domEle) {
    let that = this;
    let childTagName = domEle.firstElementChild.tagName.toLowerCase();
    let childrens = Array.prototype.slice.call(that.$(domEle, childTagName, true));
    if(childrens instanceof Array) {
      childrens.forEach(child => {
        child.setAttribute('draggable', true);
        if(child.firstElementChild != null) {
          that.AddAttr(child);
        }
      });
    }
  }

  render() {
    return React.createElement("div", {
      id: "drag-drop"
    }, React.Children.map(this.props.children, child => {
      return child;
    }));
  }
}