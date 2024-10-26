// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { useSelector, useDispatch } from 'src/store/Store';
import { IconButton, InputBase, Box } from '@mui/material';
import { IconPaperclip, IconPhoto, IconSend } from '@tabler/icons-react';
import { addMsg, sendMsg } from 'src/store/apps/chat/ChatSlice';
import { getLLamaAnswer } from 'src/utils/llamaai/LlamaService';

const ChatMsgSent = () => {
  const [msg, setMsg] = React.useState<any>('');
  const dispatch = useDispatch();

  const id = useSelector((state) => state.chatReducer.chatContent);

  const handleChatMsgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const newMsg = { id, msg };

  const onChatMsgSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addMsg(id ? id: 1, id, newMsg.msg));
    setMsg('');
  };

  return (
    <Box p={2}
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
          onClick={() => {
            dispatch(sendMsg(newMsg));
            setMsg('');
          }}
          disabled={!msg}
          color="primary"
        >
          <IconSend stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete">
          <IconPhoto stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete">
          <IconPaperclip stroke={1.5} size="20" />
        </IconButton>
      </form>
    </Box>
  );
};

export default ChatMsgSent;
