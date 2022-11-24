import React, {useCallback, useEffect, useState} from "react";

import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";
import {useParams} from "react-router-dom";

export const Index = ({user, updateData}) => {
    const {id} = useParams();
    const [text, setText] = useState('');

    const onSubmit = async () => {
        try {
            const fields = {
                text
            };
            setText('');
            await axios.post(`/posts/${id}/add-comment`, fields);
            return axios.get(`/posts/${id}/get-comment`)
                .then((response) => {
                    updateData(response.data);
                })
                .catch((error) => {
                    console.error(error);
                    alert("Error getting comments");
                });
        } catch (error) {
            alert('Error posting comment')
        }
    };


    return (
        <>
            <div className={styles.root}>
                <Avatar
                    classes={{root: styles.avatar}}
                    src={user.avatarUrl ? `http://localhost:5000${user.avatarUrl}` : '/noavatar.png'}
                    alt={user.fullName}
                />
                <div className={styles.form}>
                    <TextField
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        label="Write a comment"
                        variant="outlined"
                        maxRows={10}
                        multiline
                        fullWidth
                    />
                    <Button onClick={onSubmit} variant="contained">Send</Button>
                </div>
            </div>
        </>
    );
};
