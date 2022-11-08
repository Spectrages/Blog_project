import React, {useEffect, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import {useDispatch, useSelector} from "react-redux";

import {Post} from '../components/Post';
import {TagsBlock} from '../components/TagsBlock';
import {CommentsBlock} from '../components/CommentsBlock';
import {fetchPosts, fetchTags} from "../redux/slices/posts";
import {fetchLogin} from "../redux/slices/auth";

export const Home = () => {

    const [value, setValue] = useState(0);
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.data);
    const {posts, tags} = useSelector(state => state.posts);
    const isPostLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';
    useEffect(() => {
        dispatch(fetchLogin());
        dispatch(fetchPosts());
        dispatch(fetchTags());
    }, []);

    const handleChange = (event, value) => {
        event.stopPropagation();
        if (value > 0) {
            setValue(0)
        } else {
            setValue(1);
        }
    };

    const popularPosts = (posts) => {
        if(posts.length > 0) {
            let copy = Object.assign([], posts);
            copy.sort((a, b) => a.viewsCount < b.viewsCount);
            return copy;
        }
    };

    return (
        <React.Fragment>
            <Tabs
                style={{marginBottom: 15}}
                value={value}
                aria-label="basic tabs example"
                onChange={event => handleChange(event, value)}
            >
                <Tab label="New"/>
                <Tab label="Popular"/>
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {value === 0 ? (isPostLoading ? [...Array(5)] : posts.items).map((obj, index) => isPostLoading
                        ? (<Post key={index} isLoading={true}/>)
                        : (<Post
                            _id={obj._id}
                            title={obj.title}
                            imageUrl={obj.imageUrl ? `http://localhost:5000${obj.imageUrl}` : ''}
                            user={obj.user}
                            createdAt={obj.createdAt}
                            viewsCount={obj.viewsCount}
                            commentsCount={obj.commentCount}
                            tags={obj.tags}
                            isEditable={userData?._id === obj.user?._id}
                        />)).reverse()
                        :
                        popularPosts(posts.items).map((obj) => (
                            <Post
                                _id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl ? `http://localhost:5000${obj.imageUrl}` : ''}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.commentCount}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user?._id}
                            />))
                    }

                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading}/>
                    {/*<CommentsBlock*/}
                    {/*    items={comments.items}*/}
                    {/*    isLoading={isCommentsLoading}*/}
                    {/*/>*/}
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
