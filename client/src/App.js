import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Room from "./pages/Room";
import ChatState from "./context/ChatState";
import AllRooms from "./pages/AllRooms";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SignUp from "./components/Signup";
import Login from "./components/Login";

function App() {

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: "#1C6AFC",
        contrastText: "#FFFFFF"
      },
      secondary: {
        main: "#FFFFFF",
        contrastText: "#1A181E"
      },
    },
    typography:{
      fontFamily: ["Inter", "sans-serif"].join(","),
    },
    root: {
      }
  });
  return (
    <ThemeProvider theme={theme}>
    <div>
      <ChatState>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUp/>}></Route>
            <Route path="/" element={<Login/>}></Route>
            <Route path="/room/" element={<AllRooms />}></Route>
            <Route path="/room/:roomId" element={ <Room />}></Route>
          </Routes>
          <NavBar />
        </Router>
      </ChatState>
    </div>
    </ThemeProvider>
  );
}

export default App;
