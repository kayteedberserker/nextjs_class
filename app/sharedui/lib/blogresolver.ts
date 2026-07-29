import type { Blog } from "@/app/types/post";
import blogmodel from "../database/model/blog";
import { bookmodel } from "../database/model/book";
import { usermodel } from "../database/model/user";
import type { Book } from "./data";



export const blogresolver = {
    Query: {
        book: async () => {
            const allbook = await bookmodel.find();
            return allbook;
        },

        onebook: async (_: unknown, { id }: { id: string }) => {
            const onebook = await bookmodel.findById(id);
            return onebook;
        },

        getallblog: async (_: unknown, { id, page, limit }: { id: string, page: number, limit: number }) => {
            if (!id) {
                throw new Error("Invalid Id");
            }
            const skip = (page - 1) * limit;

            const totalNum = await blogmodel.countDocuments({ author: id });
            const allblog = await blogmodel.find({ author: id })
                .skip(skip)
                .limit(limit);
            return { allblog, totalNum };
        }
    },
    Mutation: {
        addBook: async (_: unknown, { input }: Book) => {
            console.log(input);
            const { title, author, year } = input
            if (!title || !author || !year) {
                throw new Error("All field are mandatory")
            }
            const newbook = await bookmodel.create(input)
            if (newbook) {
                return newbook
            }
        },

        deleteBook: async (_: unknown, { id }: { id: string }) => {
            try {
                const deletedBook = await bookmodel.findByIdAndDelete(id)
                return deletedBook

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message)
                }
            }
        },
        addBlog: async (_: unknown, { input }: { input: Blog }) => {
            try {
                const { title, content, author, category, blogcover } = input
                if (!title || !content || !author || !category) {
                    throw new Error("All field are mandatory")
                }
                console.log(blogcover, "is the image url")
                const authordetail = await usermodel.findOne({ username: author })
                const newblog = await blogmodel.create({
                    ...input,
                    author: authordetail._id,
                })
                if (newblog) {
                    return newblog
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message)
                }
            }
        }

    }

}