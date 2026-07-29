
"use client"
import type { Login } from '@/app/types/post'
import type { TypedDocumentNode } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import gql from 'graphql-tag'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

type Loginresult = {
  loginuser: {
    existuser: {
      id: string
      email: string
      username: string
    }
    token: string
  }
}

const LOGIN_QUERY: TypedDocumentNode<Loginresult, { input: Login }> = gql`
mutation loginuser($input:loginInput!){
  loginuser(input:$input){
    existuser {
      id,
      email,
      username
    }
    token
  }
}
`

const LoginForm = () => {
    const router = useRouter()
     const {register, handleSubmit} = useForm<Login>()
      const [loguser, {loading} ] = useMutation(LOGIN_QUERY)
     const loginuser = async (values:Login) =>{
        try {
          console.log(values);
         const {data} =  await loguser({variables:{input:values}})
           console.log(data?.loginuser?.token);

           // save the logged in user so we can read the author id later
           if (data?.loginuser?.existuser) {
             localStorage.setItem("existuser", JSON.stringify(data.loginuser.existuser))
           }

           const response = await fetch("/api/setcookies", {
            method: "POST",
            body: JSON.stringify({ token:data?.loginuser?.token}),
           })
           if (response.status == 200) {
            router.push('/blog')
           }
        } catch (error) {
          console.log(error);

        }
     }
  return (
    <div>
    <form onSubmit={handleSubmit(loginuser)} className='w-[500px] mx-auto px-6' action="">
        <input className="w-full rounded border px-3 py-2" {...register("email")} type="text" placeholder='Email'/>
        <input className="w-full rounded border px-3 py-2" {...register("password")} type="password" placeholder='Password'/>
        <button type='submit'>{loading ? "Loading ..." : "Login"}</button>
      </form>
    </div>
  )
}

export default LoginForm
