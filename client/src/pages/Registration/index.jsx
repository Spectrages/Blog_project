import React, {useRef, useState} from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";
import axios from "../../axios";

export const Registration = () => {

    const [avatarUrl, setAvatarUrl] = useState('');
    const inputFileRef = useRef({});

    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const {data} = await axios.post('/upload', formData);
            setAvatarUrl(data.url);
        } catch (error) {
            console.error(error)
        }
    };
    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm({
        defaultValues: {
            avatarUrl: '',
            fullName: '',
            email: '',
            password: '',
        },
        mode: 'onChange'
    });

    const onSubmit = async (values) => {
        values.avatarUrl = avatarUrl;
        const data = await dispatch(fetchRegister(values));
        if (!data.payload) {
            alert("Failed to register");
        }
        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    };

    if (isAuth) {
        return <Navigate to={'/'}/>
    }

    return (
        <Paper classes={{root: styles.root}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography classes={{root: styles.title}} variant="h5">
                    Create an account
                </Typography>
                <div className={styles.avatar}>
                    <input
                        ref={inputFileRef}
                        type="file"
                        onChange={handleChangeFile}
                        hidden
                    />
                    {avatarUrl ?
                        <img
                            onClick={() => inputFileRef.current.click()}
                            src={`http://localhost:5000${avatarUrl}`}
                            style={{width: '100px'}}
                            alt="Uploaded"
                            {...register('avatarUrl')}
                        />
                    :
                        <Avatar onClick={() => inputFileRef.current.click()} className={styles.avatar_pic} sx={{width: 100, height: 100}}/>
                    }
                </div>
                <TextField
                    className={styles.field}
                    label="Full name"
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    {...register('fullName', {required: 'Enter your full name'})}
                    type="fullName"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register('email', {required: 'Enter your email'})}
                    type="email"
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="password"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', {required: 'Enter your password'})}
                    type="password"
                    fullWidth
                />
                <Button type="submit" disabled={!isValid} size="large" variant="contained" fullWidth>
                    Register
                </Button>
            </form>
        </Paper>
    );
};
