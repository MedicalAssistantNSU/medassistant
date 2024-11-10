// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'src/store/Store';
import { IconButton, InputBase, Box, Backdrop, Modal, Fade } from '@mui/material';
import { IconPaperclip, IconPhoto, IconSend } from '@tabler/icons-react';
import { addMsg, sendMsg } from 'src/store/apps/chat/ChatSlice';
import { getLLamaAnswer } from 'src/utils/llamaai/LlamaService';
import FileUpload from '../FileUpload';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '85%',
  bgcolor: 'background.paper',
  overflowY: 'auto',
  boxShadow: 24,
  p: 4,
};

const ChatMsgSent = () => {
  const [msg, setMsg] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [image, setImage] = useState("");
  const dispatch = useDispatch();

  const id = useSelector((state) => state.chatReducer.chatContent);

  const handleChatMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const onChatMsgSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (image != "") {
      setMsg(image)
    }
    console.log(msg)
    console.log(image)
    dispatch(addMsg(id ? id: 1, id, image != "" ? "image" : "text", image != "" ? image : msg));
    setMsg("");
    setImage("");
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
      height={"120px"}
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
          disabled={!msg && image==""}
          color="primary"
        >
          <IconSend stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => setOpenImage(true)}>
          <IconPhoto stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete">
          <IconPaperclip stroke={1.5} size="20" />
        </IconButton>
      </form>
    </Box>
    </>
  );
};

export default ChatMsgSent;
