import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from './redux/authSlice';


const Sidebar = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let user = useSelector(reducers=>reducers.auth.user);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (<>
    <div className="flex flex-col h-full w-[20vw] bg-gray-800 text-white">
      {/* Logo/Header */}
      <div className="py-4 px-6 bg-gray-900">
        <h1 className="text-2xl font-bold">Synergy</h1>
      </div>

      {/* User Info */}
      <div className="py-4 px-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-700">
          <img src={`http://robohash.org/${user.email}`} alt="" />
        </div>
        <h2 className="text-lg font-medium mt-2">@{user.username}</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-6 py-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Home
            </Link>
          </li>
          <li>
            <div
              className="block py-2 px-4 rounded hover:bg-gray-700 cursor-pointer"
              onClick={()=>{setIsSearchOpen(prev=>!prev)}}>
            Search
            </div>
          </li>
          <li>
            <Link
              to="/messages"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Messages
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="py-4 px-6">
        <button className="block w-full py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white" onClick={()=>{
          dispatch(logoutUser())
          navigate('/login');
        }}>
          Logout
        </button>
      </div>
    </div>
    { isSearchOpen && <Search />}
    </>);
};
const dummyUsers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
  { id: 4, name: 'Bob Anderson' },
];
const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  const handleSearch = () => {
    // Perform search logic here (e.g., fetch users based on the searchTerm)
    // Replace the following example logic with your own search implementation
    const filteredUsers = dummyUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="w-20vw bg-gray-600">
      <input
        type="text"
        className="w-full p-2 mb-2"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSearch}>
        Search
      </button>

      {users.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Users:</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4">No users found.</p>
      )}
    </div>
  );
};

export default Sidebar;
