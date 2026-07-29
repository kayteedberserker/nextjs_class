"use client"

import type { Book } from '@/app/sharedui/lib/data'
import { useQuery } from '@apollo/client/react'
import gql from 'graphql-tag'
export const GET_BOOKS = gql`
query getbook {
  book{
    id,
    title,
    author
  }
}
`

const GetBooks =  () => {
    const {data, loading} =  useQuery<{book: Book[]}>(GET_BOOKS)
    console.log(data);
    if (loading) {
        return <h1>Loading...</h1>
    }
  return (
    <div>{data?.book?.map((book)=>(
        <>
        <p>{book.title}</p>
        </>
    ))     
        }</div>
  )
}

export default GetBooks