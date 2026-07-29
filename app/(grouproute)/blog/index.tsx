"use client"
import type { Blog } from '@/app/types/post'
import type { TypedDocumentNode } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import gql from 'graphql-tag'
import { useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Addblogresult = {
    addBlog: {
        id: string
        title: string
        content: string
        category: string
        author: string
    }
}

const ADD_BLOG: TypedDocumentNode<Addblogresult, { input: Blog }> = gql`
mutation addblog($input: blogInput!) {
  addBlog(input: $input) {
    id
    title
    content
    category
    author
  }
}
`

const Blogschema = z.object({
    title: z.string().min(3, "title cannot be less than 3 characters").trim(),
    content: z.string().min(10, "content cannot be less than 10 characters").trim(),
    category: z.string().min(3, "category cannot be less than 3 characters").trim()
})

export type blogform = z.infer<typeof Blogschema>

const Bloginput = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<blogform>({ resolver: zodResolver(Blogschema) })
    const [createblog, { loading }] = useMutation(ADD_BLOG)
    const [imageUrl, setImageUrl] = useState('')

    const addblog = async (values: blogform) => {
        try {
            // the addBlog resolver looks the author up by username, so send that
            const stored = localStorage.getItem("existuser")
            const user = stored ? JSON.parse(stored) : null
            console.log(user?.username)
            if (!user?.username) {
                console.log("no logged in user found");
                return
            }

            const response = await createblog({
                variables: { input: { ...values, author: user.username, blogcover: imageUrl } },
                refetchQueries: ["allblog"],
            })
            if (response) {
                console.log(response)
                reset()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files?.[0])
        const file = e.target.files?.[0]
        const cloudname = "dxqsvqhgl"
        const uploadPreset = "blogimage"

        const formData = new FormData()

        formData.append('upload_preset', uploadPreset)
        formData.append('file', file!)

        const url = `https://api.cloudinary.com/v1_1/${cloudname}/upload`

        try {
            const res = await fetch(url, {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            setImageUrl(data?.secure_url)
            console.log(data)
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <form onSubmit={handleSubmit(addblog)} className="border border-gray-300 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Add a new blog</h2>
            <input className="w-full rounded border border-gray-300 px-3 py-2" {...register("title")} type="text" placeholder='Title' />
            <small className="text-red-500 block mb-2">{errors.title && errors.title.message}</small>
            <input className="w-full rounded border border-gray-300 px-3 py-2" {...register("category")} type="text" placeholder='Category' />
            <small className="text-red-500 block mb-2">{errors.category && errors.category.message}</small>
            <textarea className="w-full rounded border border-gray-300 px-3 py-2" {...register("content")} placeholder='Content' rows={5} />
            <small className="text-red-500 block mb-2">{errors.content && errors.content.message}</small>
            <div className='flex justify-between'>
                <input type="file" onChange={handleFileChange} id="" />
                <button type='submit' disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50">
                    {loading ? "Loading..." : "Add Blog"}
                </button>
            </div>
        </form>
    )
}

export default Bloginput
