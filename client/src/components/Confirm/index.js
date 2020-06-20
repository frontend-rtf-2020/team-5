import React, { useState } from "react";
import { useHistory } from 'react-router-dom';


export default function Confirm(props) {
    const history = useHistory();

    fetch('https://api.rtf17.ru/confirm_account', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({confirmation_code: props.match.params.code}),

    }).then(r => {
        return r.json()
    })
        .then(data => {
            if(data.success === true){
                history.push("/login");

            }
            else {
                return("wrong code");
            }

        });
return(
    <></>
);
}