import React from 'react';
import './Toolbar.css';

export default function Toolbar(props) {
    const { title, leftItems, rightItems, positionOaoa } = props;
    function e(){if (title === '') {
        return 'Select conversation'}
    else return title;}
    function f() {
        if (title === '') {
            return null;
        }
        else {
            return rightItems
        }
    }
    return (
      <div className={"toolbar" + positionOaoa}>
        <div className="left-items">{ leftItems }</div>
        <h1 className="toolbar-title">{ e() }</h1>
        <div className="right-items">{ f() }</div>
      </div>
    );
}