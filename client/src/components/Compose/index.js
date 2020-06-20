import React from 'react';
import './Compose.css';

export default function Compose(props) {

    return (
      <div className="compose">
        <input
            ref={props.inputRef}
          type="text"
          className="compose-input"
          placeholder="Write a message..."
            onKeyPress={event => {
              if (event.key === "Enter"){
                  props.onMessageSubmit(event.target.value)
              }
          }}
        />
          <i className={`toolbar-button ion-ios-arrow-dropright-circle`} onClick={() => {props.onMessageSubmit(props.inputRef.current.value)}}/>
      </div>
    );
}