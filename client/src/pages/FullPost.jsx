import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom"
import {Post} from "../components/Post";
import {Index} from "../components/AddComment";
import {CommentsBlock} from "../components/CommentsBlock";
import {ReactMarkdown} from "react-markdown/lib/react-markdown";

import axios from '../axios'
import {fetchLogin} from "../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";
//${process.env.REACT_APP_API_URL}
export const FullPost = () => {
    const [data, setData] = useState();
    const [counterComments, setCounterComments] = useState(0);
    const [comments, setComments] = useState();
    const [postLoading, setPostLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [user, setUser] = useState();
    const {id} = useParams();
    const userData = useSelector(state => Boolean(state.auth.data));
    const dispatch = useDispatch();
    console.log(likes);

    useEffect(() => {
        axios.get(`/auth/me`)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios.get(`/posts/${id}`)
            .then((response) => {
                setData(response.data);
                setLikes(response.data.postLikes.length)
                setPostLoading(false);
            })
            .catch((error) => {
                console.error(error);
                alert("Error getting article");
            });
        dispatch(fetchLogin());
    }, []);


    useEffect(() => {
        axios.get(`/posts/${id}/get-comment`)
            .then((response) => {
                setComments(response.data);
                setCounterComments(response.data.length);
                setCommentsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                alert("Error getting comments");
            });
    }, [setComments]);

    if (postLoading) {
        return <Post isLoading={postLoading} isFullPost/>
    }
    const updateData = (comments) => {
        setComments(comments)
    };
return (
    <React.Fragment>
        <Post
            _id={data._id}
            title={data.title}
            imageUrl={data.imageUrl ? `http://localhost:5000${data.imageUrl}` : ''}
            user={data.user}
            createdAt={data.createdAt}
            viewsCount={data.viewsCount}
            commentsCount={counterComments}
            tags={data.tags}
            postLikes={likes}
            isFullPost
        >
            <ReactMarkdown children={data.text}/>
        </Post>
        <CommentsBlock
            items={comments}
            isLoading={commentsLoading}
            isAuth={Boolean(userData)}
        >
            {Boolean(userData) ? <Index user={user} updateData={updateData}/> : ''}
        </CommentsBlock>
    </React.Fragment>
);
};
