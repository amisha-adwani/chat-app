import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ChatContext from "../context/ChatContext";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import Details from "./Avatar";
import Board from "./Board";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
const ChatBox = ({ userNotification }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = () => setOpen(!open);
  const context = useContext(ChatContext);
  const {
    message,
    setMessage,
    setMessageReceived,
    messageReceived,
    socket,
    username,
    senderId,
  } = context;
  const { roomId } = useParams();
  useEffect(() => {
    setMessageReceived([]);
    socket.on("receive_message", (data) => {
      setMessageReceived((prevMessages) => [
        ...prevMessages,
        {
          message: data.message,
          senderId: data.senderId,
          username: data.username,
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, setMessageReceived]);

  const handleClick = () => {
    socket.emit("send_message", { message, roomId, senderId, username });
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const navigate = useNavigate();
  const onHandleClick = () => {
    socket.emit("leave-room", { roomId, senderId });
    navigate("/room");
  };
  const onDelete = () => {
    socket.emit("remove-room", { roomId, senderId });
    navigate("/room/");
  };
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;
  return (
    <div>
      <Box minHeight={540} ml={9} mt={10} overflow="auto">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={openMenu ? "long-menu" : undefined}
          aria-expanded={openMenu ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          paper={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem sx={{ textTransform: "none" }} onClick={onHandleClick}>
            Leave chat
          </MenuItem>
          <MenuItem sx={{ textTransform: "none" }} onClick={onDelete}>
            Delete room
          </MenuItem>
          <MenuItem sx={{ textTransform: "none" }} onClick={handleOpen}>
            Canvas
          </MenuItem>
        </Menu>
        {userNotification && (
          <Typography component="div" ml={2}>
            {userNotification.map((notification, index) => (
              <div key={index}>{notification}</div>
            ))}
          </Typography>
        )}
        <Board open={open} handleOpen={handleOpen} />
        <Typography component="div">
          {messageReceived.map((msg, index) => (
            <Box
              key={index}
              component="section"
              sx={{
                // p: 2,
                mr: 2,
                mt: 1,
                display: "flex",
                 minWidth: "30%",
                ...(msg.senderId === senderId && { pl: 162 }),
                wordWrap: "break-word",
              }}
            >
              <Box
                sx={{ ...(msg.senderId === senderId && { display: "none" }) }}
              >
                <Details name={msg.username} />
              </Box>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  p: 2,
                  color: "primary.contrastText",
                  borderRadius: 3,
                  width: 150,
                }}
              >
                {`${msg.username}: ${msg.message}`}
              </Box>
            </Box>
          ))}
        </Typography>
      </Box>
      <Box
        display={"flex"}
        alignItems="center"
        mx={5}
        mt={2}
        ml={10}
        sx={{
          border: "1px solid lightblue",
          boxShadow: "4px 4px 4px  lightgray",
        }}
      >
        <TextField
          fullWidth
          sx={{
            "& fieldset": { border: "none" },
          }}
          onChange={handleChange}
          value={message}
          placeholder="Enter message"
        ></TextField>
        <Button
          onClick={handleClick}
          size="large"
          sx={{ border: "none" }}
          endIcon={<SendIcon />}
        ></Button>
      </Box>
    </div>
  );
};

export default ChatBox;
