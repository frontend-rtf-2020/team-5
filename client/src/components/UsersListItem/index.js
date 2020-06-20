import React, {useEffect} from 'react';
import shave from 'shave';

import './UsersListItem.css';

export default function UsersListItem(props) {
  useEffect(() => {
    shave('.user-snippet', 20);
  });

    const { photo, name, text } = props.data;

    if (props.selected)
    {
        return (
          <div className="user-list-item-selected" onClick={() => props.onclick(props.data)}>
            <img className="user-photo" src={photo} alt="user" />
            <div className="user-info">
              <h1 className="user-title">{ name }</h1>
              <p className="user-snippet">{ text }</p>
            </div>
          </div>
        );
    }
    return (
      <div className="user-list-item" onClick={() => props.onclick(props.data)}>
        <img className="user-photo" src={photo} alt="user" />
        <div className="user-info">
          <h1 className="user-title">{ name }</h1>
          <p className="user-snippet">{ text }</p>
        </div>
      </div>
    );
}