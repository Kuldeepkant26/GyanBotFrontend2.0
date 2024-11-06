import React, { useContext, useEffect, useState } from 'react'
import '../css/allposts.css'
import axios from 'axios'
import Post from './Post';
import { MyContext } from '../Context/MyProvider';

function AllPosts() {
    const { posts, fetchPosts } = useContext(MyContext)


    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <div className='all-posts '>
            {
                posts ?
                    <div className='post-cont'>
                        {posts.map((post) => {
                            return (
                                <Post mypost={post} key={post._id}></Post>
                            )
                        })}
                    </div>
                    : <h1>Loading</h1>}

        </div>
    )
}

export default AllPosts
