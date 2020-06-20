import React, { useState, useEffect } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';
import UsersList from '../UsersList';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import { useHistory } from 'react-router-dom';

import Modal from 'react-modal';
import md5 from "react-native-md5";
import moment from "moment";


const customCreateChatStyles = {
  content : {
    top                   : '50vh',
    left                  : '50vw',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    borderRadius          : '10px',
    border                : 'none',
      width: '250px',
      color:'white',
      backgroundColor:'#000',
      padding:'35px',
  }
};

const customInfoStyles = {
    content : {
        top                   : '50vh',
        left                  : '50vw',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        borderRadius          : '10px',
        border                : 'none',
        width: '400px',
        color:'white',
        backgroundColor:'#000000',
        padding:'0px'
    }
};

const imageStyles = {
    content : {
        width : '55px !important'
    }
};


let connection = null;


export default function Messenger(props) {
    const history = useHistory();
    const [render, setRender] = useState(false);

    // useEffect(() => {
        if(localStorage.getItem("USER_TOKEN") == null) {
            history.push('/login');
            return ('');
        }
        else{
            fetch('https://api.rtf17.ru/is_valid_token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: localStorage.getItem("USER_TOKEN")}),

            }).then(r => {return r.json()})
                .then(data => {
                    if (data.success === false) {
                        history.push('/login');
                        return ('');
                    }
                    else {
                        if (connection == null){
                            connection = new WebSocket('wss://api.rtf17.ru/', localStorage.getItem("USER_TOKEN"));

                        }
                        setRender(true);
                    }
                });
        }


    // }, []);


    const [createChatModalIsOpen,setCreateChatIsOpen] = React.useState(false);
    const [infoModalIsOpen,setInfoIsOpen] = React.useState(false);
    const [ messages, setMessages ] = useState([]);
    const [conversationTitle, setConversationTitle] = useState('');
    const [chatId, setChatId] = useState('');
    const [chatInfo,setChatInfo] = useState([[],[],[],[],0,[]]);
    const [ab,setAB] = useState(0);
    const [display,setDisplay] = useState(['','']);

    if (connection != null) {
        connection.onmessage = evt => {
            let data = JSON.parse(evt.data);

            if (data.dest_chat_id === chatId) {

                let msg = {
                    id: data.id,
                    author: data.from_id,
                    authorUsername : data.from_username,
                    message: data.text,
                    timestamp: new Date(data.created_data)
                };
                console.log(msg);
                setMessages(messages.concat([
                    msg
                ]));
            } else {
                store.addNotification({
                    title: data.dest_chat_title,
                    message: data.text,
                    type: "default",
                    insert: "bottom",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true,
                        pauseOnHover: true
                    }
                });
                setAB(ab + 1);
            }
        };
    }


    
    function sendNewWsMessage(chat_id, text) {
        connection.send(JSON.stringify({dest_chat_id: chat_id, text: text}))
    }

    function updateConversationList() {
        setAB(ab +1);
    }

    function selectChat(id, name) {
        getMessages(id);
        setChatId(id);
        setConversationTitle(name)
    }

    function openCreateChatModal() {
        setCreateChatIsOpen(true);
    }

    function afterOpenCreateChatModal() {
    }

    function closeCreateChatModal(){
        setCreateChatIsOpen(false);
        setAB(ab+1);
    }

    function openInfoModal() {
        let chat_id = chatId;
        fetch('https://api.rtf17.ru/chat_infos', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem("USER_TOKEN")
            },
            body: JSON.stringify({chat_id: chat_id}),

        }).then(r => {return r.json()})
            .then(data => {
                let tempMembersName = new Array(data.name_list.length);
                let tempMembersLogin = new Array(data.login_list.length);
                let tempMembersLoginImage = new Array(data.login_list.length);
                let tempMembersOnline = new Array(data.login_list.length);

                data.name_list.forEach(function(item, i) {
                    tempMembersName[i] = item;
                });
                data.login_list.forEach(function(item, i) {
                    tempMembersLogin[i] = item;
                    tempMembersLoginImage[i] = `https://www.gravatar.com/avatar/${md5.hex_md5(item)}?s=100g&d=identicon&r=PG`;

                });
                data.onlines.forEach(function (item, i) {
                    tempMembersOnline[i] = new Date(item);
                });
                setChatInfo([[data.name,`https://www.gravatar.com/avatar/${md5.hex_md5(data.name)}?s=100g&d=identicon&r=PG`],
                    tempMembersName,tempMembersLoginImage, tempMembersLogin,
                    tempMembersName.length,
                    tempMembersOnline
                ]);

            }).then(() => {
                    setInfoIsOpen(true);
            })
    }

    function afterOpenInfoModal() {
    }

    function closeInfoModal(){
        setInfoIsOpen(false);
    }

    function mobileSidebar() {
        setDisplay([' none-display-haruno',' close-tab-sidebar']);
    }

    function mobileSidebarClose() {
        setDisplay([' ',' ']);
    }

    function memberCase() {
        let tempElement = new Array(chatInfo[3].length);
        chatInfo[3].forEach(function (item, i) {
            let diff = Date.now() - chatInfo[5][i];
            let date = '';
            if (diff < 600000){
                date = ' Online'
            }else {
                date = ' last seen ' + moment(chatInfo[5][i]).format('MMM D HH:mm');
            }


            tempElement[i] = (<div className={"chat-member-info"}>
                <img style={imageStyles} className={"chat-photo"} src={chatInfo[2][i]} alt=""/>
                <div className={"chat-name-member"}>
                    <h1 className="conversation-title">{chatInfo[1][i]} </h1>
                    <p className="conversation-snippet">@{chatInfo[3][i] + date}</p>
                </div>
            </div>);
        });
        return [...tempElement];
    }

    const getMessages = (id) => {
        fetch('https://api.rtf17.ru/get_messages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem("USER_TOKEN")
            },
            body: JSON.stringify({chat_id: id}),

        }).then(r => {
            return r.json()
        })
            .then(data => {
                let tempMessages = data.map(e => {
                    return {
                        id: e.id,
                        author: e.owner,
                        message: e.text,
                        timestamp: new Date(e.date),
                        authorUsername: e.author_username

                    }
                });
                setMessages([...tempMessages]);
            });
    };
    if (render){
    return (
        <div id="Login">
        <div id="back-ground"></div>
      <div className="messenger">
          <ReactNotification />


        <Modal
          isOpen={createChatModalIsOpen}
          onAfterOpen={afterOpenCreateChatModal}
          onRequestClose={closeCreateChatModal}
          style={customCreateChatStyles}
          contentLabel="Example Modal"
        >
            <div className="createAndClose">
            <h2>Create chat</h2>
                <i className={`toolbar-button ion-ios-close-circle-outline`} onClick={closeCreateChatModal}/>
            </div>
            <UsersList selectChat={selectChat} closeModal={closeCreateChatModal} onclick={props.onclick}/>

        </Modal>

          <Modal
              isOpen={infoModalIsOpen}
              onAfterOpen={afterOpenInfoModal}
              onRequestClose={closeInfoModal}
              style={customInfoStyles}
              contentLabel="Example Modal"
          >
              <div className="modal-info-close">
                  <h2>Chat info</h2>
                  <i className={`toolbar-button ion-ios-close-circle-outline`  } onClick={closeInfoModal}/>
              </div>

                <div className={"chat-main-info"}>
                    <img className={"chat-photo"} src={chatInfo[0][1]} alt=""/>
                    <div className={"conversation-info"}>
                        <h1 className="conversation-title">{chatInfo[0][0]} </h1>
                        <p className="conversation-snippet">{chatInfo[4]} members</p>
                    </div>
                </div>
              <div className="members-case">
                  <div className={"members-title"}>Members:</div>
                  <div className="scrollMembers">
                      {memberCase()}
                  </div>
              </div>



          </Modal>
          <div className={"sidebar-close" + display[1]} onClick={mobileSidebarClose}></div>
        <div className={"scrollable sidebar" + display[0]}>

          <ConversationList onclick={selectChat} openSidebar={mobileSidebarClose} openCreateDialogue={openCreateChatModal} ab={ab}/>
        </div>

        <div className="scrollable content">
          <MessageList openInfoModal={openInfoModal} openSidebar={mobileSidebar} chatId={chatId} updateConversationList={updateConversationList}conversationTitle={conversationTitle} messages={messages} sendNewWsMessage={sendNewWsMessage}/>
        </div>
      </div>
        </div>
    );
    }
    else{
        return ('');
    }
}