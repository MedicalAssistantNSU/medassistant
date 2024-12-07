// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Backdrop, Box, Fade, IconButton, InputBase, Modal } from '@mui/material';
import { IconPaperclip, IconPhoto, IconSend } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { addMsg, fetchChats } from 'src/store/apps/chat/ChatSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import FileUpload from '../FileUpload';
import { sub } from 'date-fns';
import { reject } from 'lodash';

const URL = 'ws://localhost:8080/api/v2/chats/'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '50%',
    bgcolor: 'background.paper',
    overflowY: 'auto',
    boxShadow: 24,
    p: 4,
};

const ChatMsgSent = ({setIsLoaging, IsLoading} : {setIsLoaging: React.Dispatch<React.SetStateAction<boolean>>, IsLoading: boolean}) => {
  const [msg, setMsg] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken")
  const id = useSelector((state) => state.chatReducer.chatContent)

  const socketRef = useRef(new WebSocket(URL + token)); 

  useEffect(() => {
    socketRef.current = new WebSocket(URL + token);

    socketRef.current.onmessage = (event) => {
      const response = JSON.parse(event.data);

      dispatch(addMsg(id ? id: 1, response));
      dispatch(fetchChats());
      setIsLoaging(false)
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);


  const handleChatMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const onChatMsgSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (image != "") {
      setMsg(image)
    }
  
    const newMessage = {
      chatId: id,
      content: image != "" ? image : msg,
      type: image != "" ? "image" : "text",
      createdAt: sub(new Date(), { seconds: 1 }),
    };

    console.log(newMessage)

    dispatch(addMsg(id ? id: 1, newMessage));
    setMsg("");
    setImage("");
    socketRef.current.send(JSON.stringify(newMessage))
    setIsLoaging(true)
  };

  return (
    <>
    <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openImage}
                onClose={() => setOpenImage(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={openImage}>
                    <Box sx={style}>
                      <FileUpload load={setImage}/>
                    </Box>
                </Fade>
            </Modal>
    <Box p={1}
      mt={1}
      height={"60px"}
    >
      {/* ------------------------------------------- */}
      {/* sent chat */}
      {/* ------------------------------------------- */}
      <form
        onSubmit={onChatMsgSubmit}
        style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
      >
        <InputBase
          id="msg-sent"
          fullWidth
          value={msg}
          placeholder="Написать"
          size="small"
          type="text"
          inputProps={{ 'aria-label': 'Написать' }}
          onChange={handleChatMsgChange.bind(null)}
        />
        <IconButton
          aria-label="delete"
          onClick={onChatMsgSubmit}
          disabled={(!msg && image=="") || IsLoading}
          color="primary"
        >
          <IconSend stroke={1.5} size="20" />
        </IconButton>
        {/* <IconButton aria-label="delete" onClick={() => setOpenImage(true)}>
          <IconPhoto stroke={1.5} size="20" />
        </IconButton> */}
        <IconButton aria-label="delete" onClick={() => setOpenImage(true)}>
          <IconPaperclip stroke={1.5} size="20" />
        </IconButton>
      </form>
    </Box>
    </>
  );
};

export default ChatMsgSent;
