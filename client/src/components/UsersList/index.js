import React, {useState, useEffect, useRef} from 'react';
import UsersSearch from '../UsersSearchNEW';
import UsersListItem from '../UsersListItem';
import md5 from "react-native-md5";


import './UsersList.css';
import {store} from "react-notifications-component";



export default function UsersList(props) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const usersInput = useRef();
    const chatName = useRef();
    useEffect(() => {
        getUsers("")
    }, []);

    const updateList = () =>  {
        let usersTemp = [...users];
        usersTemp.forEach(e => e.selected = false)
        setUsers([]);
        let selUsersTemp = [...selectedUsers];
        selUsersTemp.forEach( u => u.selected = true);
        setUsers(selUsersTemp.concat(usersTemp.filter(e => !selectedUsers.map(t => t.id).includes( e.id))))
    };

    useEffect(updateList, [selectedUsers]);

    const createChat = () => {
        if(chatName.current.value.length < 3 || chatName.current.value.length > 18) {
            store.addNotification({
                title: 'Warning!',
                message: 'chat name must contain between 3 and 18 characters',
                type: "warning",
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
            return;
        };
        if(selectedUsers.length === 0) {
            store.addNotification({
                title: 'Warning!',
                message: 'Add users',
                type: "warning",
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
            return;
        }
        else {
            fetch('https://api.rtf17.ru/create_chat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Auth-Token': localStorage.getItem("USER_TOKEN"),
                },
                body: JSON.stringify({name: chatName.current.value, user_ids: selectedUsers.map(e => e.id)}),

            }).then(r => {return r.json()})
                .then(data => {


                store.addNotification({
                    message: 'Chat created',
                    type: "success",
                    insert: "bottom",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: true,
                        pauseOnHover: false
                    }
                });
                props.closeModal();
                props.selectChat(data.id,data.name);
                return;
            })
        }
    };

    const getUsers = (query) => {
        if (selectedUsers.length > 4){
            return
        }
        fetch('https://api.rtf17.ru/search_users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem("USER_TOKEN")
            },
            body: JSON.stringify({query: query}),

        }).then(r => {return r.json()})
            .then(data => {
                let newUsers = data.map(result => {
                return {
                    photo: `https://www.gravatar.com/avatar/${md5.hex_md5(result.login)}?s=100g&d=identicon&r=PG`,
                    name: `${result.name}`,
                    text: `@${result.login}`,
                    id: result.id
                };
            });
            setUsers([]);
            let selUsersTemp = [...selectedUsers];
            selUsersTemp.forEach( u => u.selected = true);
            setUsers(selUsersTemp.concat(newUsers.filter(e => !selectedUsers.map(t => t.id).includes( e.id))))
            })
    };

    function onUserSelect(user) {
        if (selectedUsers.map(u => u.id).includes(user.id)){
            setSelectedUsers([...selectedUsers.filter(u => u.id !== user.id)])
        } else {
            setSelectedUsers([...selectedUsers].concat(user));
        }
    }

        return (
            <div>
                <div>
                    <p className={'textForm'}>Chat name:</p>
                    <input
                        ref={chatName}
                        type="search"
                        className="conversation-search-input-n"
                        placeholder="Chat name"
                    />
                </div>
                <p className={'textForm'}>Find users:</p>
                <UsersSearch onchange={getUsers} usersInput={usersInput}/>
                <div className="conversation-list-n">
                    {
                        users.map(user =>
                            <UsersListItem
                                selected={user.selected}
                                key={user.id}
                                data={user}
                                onclick={onUserSelect}
                            />
                        )
                    }
                </div>
                <button onClick={createChat} className="send-users-btn">Create</button>
            </div>
        );
}