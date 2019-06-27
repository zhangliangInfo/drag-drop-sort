import React, { Component } from 'react';

export default class DragDropSort extends Component {
  constructor(props) {
    super(props);
    this.callback = this.props.callback;
    this.dragTag  = this.props.dragTag && this.props.dragTag.toLowerCase();
    // set the state.
    this.state = {
      data: this.props.data
    };
  }

  componentDidMount() {
    let ele = '#drag-drop';
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

  componentDidUpdate(prevProps) {
    this.AddAttr(this._parent);
    if(JSON.stringify(this.props.data) != JSON.stringify(prevProps.data)) {
      this.setState({
        data: this.props.data
      });
    }
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
      that.enterObj = that.FindParent(that._parent, e.target);

      // the enter Object must is the children of _parent.
      if(that.enterObj != undefined) {
        that.$(that._parent, that.childTagName, true).forEach((dom, idx) => {
          if(dom == that.enterObj) {
            that.enterIdx = idx;
          };
        });
        if(that.targetIdx < that.enterIdx) {
          that.enterObj.style.borderRight = '2px dashed #1890ff';
        } else if(that.targetIdx > that.enterIdx) {
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
  
    that._parent.addEventListener('dragleave', e => {
      e.preventDefault();
      let tar = that.FindParent(that._parent, e.target);
      let _tar = that.FindParent(that._parent, that.enterObj);
      if(tar.getAttribute('style') && e.target == _tar) {
        tar.removeAttribute('style');
      }
    });
  
    that._parent.addEventListener('drop', e => {
      e.preventDefault();
      let tar = that.FindParent(that._parent, e.target);

      if(tar != undefined && that.enterObj != undefined && tar.parentNode == that._parent) {
        tar.removeAttribute('style');
        if(that.targetIdx < that.enterIdx) {
          that.targetObj.remove();
          that.enterObj.after(that.targetObj)
        } else if(that.targetIdx > that.enterIdx) {
          that.targetObj.remove();
          that.enterObj.before(that.targetObj)
        }
        // process sorted data.
        let rstData = [];
        that._parent.childNodes.forEach(node => {
          node.removeAttribute('style');
          let label = node.textContent;
          rstData = rstData.concat(this.props.data.filter(item => item.label === label));
        });
        that.setState({
          data: rstData
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
  
  // Modify the parent object to be the parent of the dragTag.
  ModifyParent(_parent) {
    let parent = _parent;
    try {
      while(parent.firstElementChild && (this.dragTag != parent.firstElementChild.tagName.toLowerCase())) {
        parent = parent.firstElementChild;
        if(parent.firstElementChild == null) {
          parent = _parent;
          break;
        };
      }
    } catch(e) {
      throw ('The dragTag doesn\'t exist, please enter correct tag.');
    }
    return parent;
  }

  // Add the property dragable to all child elements.
  AddAttr(domEle) {
    let that = this;
    let childTagName = domEle.firstElementChild && domEle.firstElementChild.tagName.toLowerCase();
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
    return <div id="drag-drop">
      {
        React.Children.map(this.props.children, child => {
          return child;
        })
      }
    </div>
  }
}