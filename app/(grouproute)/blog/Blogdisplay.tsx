"use client"

import type { TypedDocumentNode } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import gql from 'graphql-tag'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Blogitem = {
    id: string
    title: string
    content: string
    category: string
    blogcover:string
}

// FIX: Updated TypeScript definition to match the server response object structure
export const GET_ALL_BLOG: TypedDocumentNode<
    { 
        getallblog: { 
            allblog: Blogitem[]; 
            totalNum: number 
        } 
    },
    { id: string | null; page: number; limit: number }
> = gql`
  query allblog($id: ID!, $page: Int!, $limit: Int!) {
    getallblog(id: $id, page: $page, limit: $limit) {
      allblog {
        id
        title
        content
        category
        blogcover
      }
      totalNum
    }
  }
`

const PAGE_SIZE = 1

const Blogdisplay = () => {
    const [authorid, setAuthorid] = useState<string | null>(null)
    const [page, setPage] = useState(1)

    useEffect(() => {
        const stored = localStorage.getItem("existuser")
        if (stored) {
            const user = JSON.parse(stored)
            setAuthorid(user?.id)
        }
    }, [])

    const { data, loading, error } = useQuery(GET_ALL_BLOG, {
        variables: { id: authorid, page, limit: PAGE_SIZE },
        skip: !authorid,
    })

    if (!authorid) return <p className="text-center text-gray-500 mt-8">Login to see your blogs</p>
    if (loading) return <p className="text-center text-gray-500 mt-8">Loading blogs...</p>
    if (error) return <p className="text-center text-red-500 mt-8">{error.message}</p>
    
    // FIX: Safely dig into the inner nested array 'allblog'
    const allblog = data?.getallblog?.allblog ?? []
    console.log(allblog)
    const totalNum = data?.getallblog?.totalNum ?? 0
    
    // FIX: You can now use the exact backend count for a foolproof last page check!
    const islastpage = page * PAGE_SIZE >= totalNum
    const totalClickableBtn = Math.ceil(totalNum / PAGE_SIZE)
    let array = []
    for (let index = 0; index < totalClickableBtn ; index++) {
        array.push(index+1)
    }
    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">My Blogs</h2>

            {allblog.length === 0 && page === 1 && (
                <p className="text-gray-500">No blogs yet. Add your first one above!</p>
            )}
            {allblog.length === 0 && page > 1 && (
                <p className="text-gray-500">No more blogs.</p>
            )}

            {allblog.map((blog) => (
                <div key={blog.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold">{blog.title}</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1">{blog.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{blog.content}</p>
                    {blog?.blogcover && <Image src={blog?.blogcover} width={100} height={400} alt={blog.title} className='w-full h-96' /> }
                </div>
            ))}

            {(allblog.length > 0 || page > 1) && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <span className='flex gap-2 mx-3'>
                        {array.map((num) => (
                            <button onClick={() => setPage(num)} className={`py-2 px-4 border border-gray-300 rounded disabled:opacity-40 ${page == num ? "bg-white text-black" : ""}`}>{num}</button>
                        ))}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={islastpage}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default Blogdisplay
