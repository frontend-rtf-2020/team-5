import React from 'react';
import moment from 'moment';
import './Message.css';

export default function Message(props) {
    const {
      data,
      isMine,
      startsSequence,
      endsSequence,
      showTimestamp
    } = props;

    const friendlyTimestamp = moment(data.timestamp).format('d MMMM y');
    const friendlyTimestam = moment(data.timestamp).format('HH:mm');
    console.log(props.authorUsername);
    return (
      <div className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {
          showTimestamp &&
            <div className="timestamp">
              { friendlyTimestamp }
            </div>
        }
          {isMine ? '': startsSequence? <div className="bubble-container">
              <div className="bubble-author">

                  <p className={"autograph"}>@{props.authorUsername}</p>
              </div>
          </div>: ''}

        <div className="bubble-container">


          <div className="bubble">
              <div className={'fefe'}>
            { data.message }
              </div>
              <div className="messageTime">
              {friendlyTimestam}
              </div>
          </div>
        </div>
      </div>
    );
}