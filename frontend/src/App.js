import "./App.css";
// import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Room from "./components/VideoCall";

function App() {
  return (
    <div className="App">
      {/* <Route path="/" component={Homepage} exact /> */}
      <Route path="/login" component={Login} exact />
      <Route path="/signup" component={Signup} exact />
      <Route path="/chats" component={Chatpage} />
      <Route path="/room" component={Room} />
    </div>
  );
}

export default App;
