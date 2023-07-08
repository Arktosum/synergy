/* eslint-disable react/prop-types */
// import { useDispatch, useSelector } from "react-redux";
import { heartIcon } from "./icons";

export default function Feed() {
  // let dispatch = useDispatch();
  // let user = useSelector(reducers=>reducers.auth.user);
  let posts=  [];
  for(let i = 0 ; i< 30 ; i++){
    posts.push(`https://picsum.photos/500/600?random=${i}`)
  }
  return (
    <div className='h-full bg-black w-full'>
      <div className="flex flex-col max-h-full overflow-y-scroll p-5 gap-10">
        {posts.map((post, index) => (
          <Post key={index} props={{post}}/>
        ))}
    </div>
    </div>
  )
}


const Post = (props) => {
  let {post} = props.props;
  let user = {
    username : "arktos",
    email : "siddhujaykay2@gmail.com"
  }
  return (
    <div className="w-[30vw] bg-[#141414] rounded-lg shadow-md mx-auto">
      <div className="post-top flex items-center mb-2 gap-5 p-2">
        <img
          src={`https://robohash.org/${user.email}`}
          alt="Profile Picture"
          className="w-10 h-10 rounded-full border-[1px] border-gray-500"
        />
        <div className="user-info">
          <p className="user-name font-bold text-white">@{user.username}</p>
          <p className="post-time text-gray-600 text-sm">5 hours ago</p>
        </div>
      </div>
      <div className="">
        <img
          src={post}
          alt="Post Image"
          className="post-image w-full"
          loading = "lazy"
        />
      </div>
      <div className="post-bottom p-2">
        <div className="flex gap-2 my-2">
          <div className="text-white cursor-pointer">{heartIcon}</div>
          <div className="text-white">10 likes</div>
        </div>
        <p className="my-2 text-white">This is the caption of the post.</p>
        <div className="w-full">
          <input type="text" className="w-full py-1 bg-inherit border-[1px] border-gray-600 p-5 text-white rounded-xl"/>
        </div>
      </div>
    </div>
  );
};

