import React, { useState } from "react";


export default function ConfirmationPage() {
return(
    <div id="Login">
        <div id="BackgroundColor"></div>
        <div className='Window'>
            <div id={'Input'}>
                <div className="Auth">
                    <h1>A confirmation email has been sent to your email address</h1>
                </div>
            </div>

            <div id={'Output'}>
                <div id="Description">
                    <h1>GoEv</h1>
                    <h2>The messenger for everyone...</h2>
                </div>
            </div>
        </div>
    </div>
);
}