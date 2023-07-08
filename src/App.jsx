import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Home from './components/Home';
import Feed from './components/Feed';
import './App.css';
import Notifications from './components/Notifications';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private routes */}
        <Route path="/" element={<Home />}>
          <Route exact path="/" element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route exact path="profile" element={<Profile />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
};


export default App;
