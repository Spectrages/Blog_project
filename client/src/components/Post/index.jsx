import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { red } from '@mui/material/colors';
import {Link} from "react-router-dom";

import styles from './Post.module.scss';
import {UserInfo} from '../UserInfo';
import {PostSkeleton} from './Skeleton';
import {useDispatch} from "react-redux";
import {fetchRemovePost, fetchPosts} from "../../redux/slices/posts";
import {logout} from "../../redux/slices/auth";
import axios from "../../axios";


export const Post = ({
                         _id,
                         title,
                         createdAt,
                         imageUrl,
                         user,
                         viewsCount,
                         commentsCount,
                         tags,
                         postLikes,
                         children,
                         isFullPost,
                         isLoading,
                         isEditable,
                         authUser,
                     }) => {
    const primary = red[500];
    const checkUserLike = (user_id, likesArray) => {
        let toggle = false;
        likesArray.map((item) => {
            if(item === user_id){
                toggle = true;
            }
        });
        return toggle;
    };

    const dispatch = useDispatch();
    if (isLoading) {
        return <PostSkeleton/>;
    }

    const onClickRemove = () => {
        if(window.confirm('Are you sure you want to delete post?')){
            dispatch(fetchRemovePost(_id));
        }
    };

    const toggle_like = () => {
        axios.post(`/posts/${_id}/toggle-like`)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.error(error);
                alert("Error added like");
            });
    };

    return (
        <div className={clsx(styles.root, {[styles.rootFull]: isFullPost})}>
            {isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/posts/${_id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon/>
                        </IconButton>
                    </Link>
                    <IconButton onClick={onClickRemove} color="secondary">
                        <DeleteIcon/>
                    </IconButton>
                </div>
            )}
            {imageUrl && (
                <img
                    className={clsx(styles.image, {[styles.imageFull]: isFullPost})}
                    src={imageUrl}
                    alt={title}
                />
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user} additionalText={createdAt}/>
                <div className={styles.indention}>
                    <h2 className={clsx(styles.title, {[styles.titleFull]: isFullPost})}>
                        {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
                    </h2>
                    <ul className={styles.tags}>
                        {tags.map((name) => (
                            <li key={name}>
                                <Link to={`/tag/${name}`}>#{name}</Link>
                            </li>
                        ))}
                    </ul>
                    {children && <div className={styles.content}>{children}</div>}
                    <ul className={styles.postDetails}>
                        <li>
                            <EyeIcon/>
                            <span>{viewsCount}</span>
                        </li>
                        <li>
                            <CommentIcon/>
                            <span>{commentsCount}</span>
                        </li>
                        <li>
                            {checkUserLike(authUser._id, postLikes) ? <FavoriteIcon sx={{color: primary}}/> : <FavoriteBorderOutlinedIcon />}
                            <span>{postLikes?.length || 0}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
