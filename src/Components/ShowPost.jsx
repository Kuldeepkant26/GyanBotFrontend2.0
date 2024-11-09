import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../css/showpost.css'
import axios from 'axios'
import Post from './Post'

function ShowPost() {
    const { pid } = useParams()
    const [post, setPost] = useState(null);

    async function fetchPost() {
        const res = await axios.get(`${import.meta.env.VITE_BURL}/posts/getpost/${pid}`);
        console.log(res.data.post);
        setPost(res.data.post)
    }
  
    useEffect(() => {
        fetchPost()

    }, [])

    return (
        <div className='show-post'>
            {post ?
                <>
                    <Post mypost={post}></Post>
                    <Link className="explore-more" to={'/allposts'} >
                        Explore more
                    </Link>
                </>

                :
                <p>Loading...</p>
            }
        </div>
    )
}

export default ShowPost
