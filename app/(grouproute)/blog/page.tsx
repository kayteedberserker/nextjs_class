import Bloginput from '.'
import Blogdisplay from './Blogdisplay'

const Blog = () => {
  return (
    <div className="mx-[15%] py-10 px-6">
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      <Bloginput />
      <Blogdisplay />
    </div>
  )
}

export default Blog