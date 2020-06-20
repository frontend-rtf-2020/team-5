import React, { useState } from 'react';


export default function UsersSearch(props) {
    let [ state, setState ] = useState({});
    const {val} = state;

    return (
        <input
            ref={props.usersInput}
            onChange={ (e) => props.onchange(e.target.value) }
          type="search"
          className="conversation-search-input-n"
          placeholder="Find users"
        />
    );
}