// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
    Alert,
    Backdrop,
    Box,
    Button,
    Fade,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import { IconChevronDown, IconPlus, IconSearch } from '@tabler/icons-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { last } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store/Store';
import { ChatsType } from 'src/types/apps/chat';
import { SearchChat, SelectChat, fetchChats } from '../../../store/apps/chat/ChatSlice';
import Scrollbar from '../../custom-scroll/Scrollbar';
import CreateChat from '../CreateChat';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '40%',
  bgcolor: 'background.paper',
  overflowY: 'auto',
  boxShadow: 24,
  p: 4,
};

const ChatListing = () => {
  const dispatch = useDispatch();
  const activeChat = useSelector((state) => state.chatReducer.chatContent);
  const [createChat, setCreateChat] = useState(false);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const filterChats = (chats: ChatsType[], cSearch: string) => {
    if (chats)
      return chats.filter((t) => t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()));

    return chats;
  };

  const chats = useSelector((state) =>
    filterChats(state.chatReducer.chats, state.chatReducer.chatSearch),
  );

  const getDetails = (conversation: ChatsType) => {
    let displayText = '';

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage) {
      const sender = lastMessage.senderId === conversation.id ? 'You: ' : '';
      const message = lastMessage.type === 'image' ? 'Sent a photo' : lastMessage.content;
      displayText = `${sender}${message}`;
    }

    return displayText;
  };

  const lastActivity = (chat: ChatsType) => last(chat.messages)?.createdAt;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={createChat}
                onClose={() => setCreateChat(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={createChat}>
                    <Box sx={style}>
                      <CreateChat/>
                    </Box>
                </Fade>
          </Modal>
      {/* ------------------------------------------- */}
      {/* Search */}
      {/* ------------------------------------------- */}
      <Box px={3} py={1}>
        <TextField
          id="outlined-search"
          placeholder="Найти чат"
          size="small"
          type="search"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconSearch size={'16'} />
              </InputAdornment>
            ),
          }}
          fullWidth
          onChange={(e) => dispatch(SearchChat(e.target.value))}
        />
      </Box>
      {/* ------------------------------------------- */}
      {/* Contact List */}
      {/* ------------------------------------------- */}
      <List sx={{ px: 0 }}>
        <Box px={2.5} pb={1}>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color="inherit"
          >
            фильтр <IconChevronDown size="16" />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>сортировать по времени</MenuItem>
          </Menu>
          <Button onClick={() => setCreateChat(true)}>
            <IconPlus />
          </Button>
        </Box>
        <Scrollbar sx={{ height: 'calc(90vh - 155px)', overflow: 'auto', maxHeight: 'calc(90vh - 155px)' }}>
          {chats && chats.length ? (
            chats.map((chat) => (
              <ListItemButton
                key={chat.id}
                onClick={() => dispatch(SelectChat(chat.id))}
                sx={{
                  mb: 0.5,
                  py: 2,
                  px: 3,
                  alignItems: 'start',
                }}
                selected={activeChat === chat.id}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                      {chat.name}
                    </Typography>
                  }
                  secondary={getDetails(chat)}
                  secondaryTypographyProps={{
                    noWrap: true,
                  }}
                  sx={{ my: 0 }}
                />
                <Box sx={{ flexShrink: '0' }} mt={0.5}>
                  <Typography variant="body2">
                    {formatDistanceToNowStrict(new Date(lastActivity(chat) ? lastActivity(chat) : 0), {
                      addSuffix: false,
                    })}
                  </Typography>
                </Box>
              </ListItemButton>
            ))
          ) : (
            <Box m={2}>
              <Alert severity="error" variant="filled" sx={{ color: 'white' }}>
                Чаты не найдены
              </Alert>
            </Box>
          )}
        </Scrollbar>
      </List>
    </div>
  );
};

export default ChatListing;
