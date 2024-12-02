// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import { IconChevronLeft, IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { useSelector } from 'src/store/Store';

import { formatDistanceToNowStrict } from 'date-fns';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import { ChatsType } from 'src/types/apps/chat';
import ChatInsideSidebar from './ChatInsideSidebar';
import ChatMsgSent from './ChatMsgSent';


interface ChatContentProps {
  toggleChatSidebar: () => void;
}

  const ChatContent: React.FC<ChatContentProps> = ({ toggleChatSidebar }) => {
  const [open, setOpen] = React.useState(true);
  // const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const chatDetails: ChatsType = useSelector(
    (state) => state.chatReducer.chats[state.chatReducer.chatContent - 1],
  );

  return (
    <Box>
      {chatDetails ? (
        <Box>
          {/* ------------------------------------------- */}
          {/* Header Part */}
          {/* ------------------------------------------- */}
          <Box 
          >
            <Box p={1} display="flex" alignItems="center" >
              <Box
                sx={{
                  display: { xs: 'block', md: 'block', lg: 'none' },
                  mr: '10px',
                }}
              >
                <IconChevronLeft stroke={1.5} onClick={toggleChatSidebar} />
              </Box>
              <ListItem key={chatDetails.id} dense disableGutters>
                <ListItemText
                  primary={<Typography variant="h5">{chatDetails.name}</Typography>}
                />
              </ListItem>
              
                <IconButton aria-label="delete" onClick={() => setOpen(!open)}>
                  <IconDotsVertical stroke={1.5} />
                </IconButton>
             
            </Box>
            <Divider />
          </Box>
          {/* ------------------------------------------- */}
          {/* Chat Content */}
          {/* ------------------------------------------- */}

          <Box display="flex">
            {/* ------------------------------------------- */}
            {/* Chat msges */}
            {/* ------------------------------------------- */}

            <Box width="100%"
            >
              <Scrollbar sx={{ height: 'calc(90vh - 155px)', overflow: 'auto', maxHeight: 'calc(90vh - 155px)',
                '&:before': {
                  content: '""',
                  background: 'radial-gradient(#2C3E50, #4CA1AF)',
                  backgroundSize: '200% 200%',
                  animation: 'gradient 15s ease infinite',
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  opacity: '0.9',
                },
              }}>
                <Box p={3}>
                  {chatDetails.messages.map((chat) => {
                    return (
                      <Box key={chat.id + chat.content + chat.createdAt}>
                        {0 === chat.senderId ? (
                          <>
                            <Box display="flex">
                              <Box>
                                {chat.createdAt ? (
                                  <Typography variant="body2" color="white" mb={1}>
                                    {formatDistanceToNowStrict(new Date(chat.createdAt), {
                                      addSuffix: false,
                                    })}{' '}
                                    ago
                                  </Typography>
                                ) : null}
                                {chat.type === 'text' ? (
                                  <Box
                                    mb={2}
                                    sx={{
                                      p: 1,
                                      backgroundColor: 'grey.100',
                                      mr: 'auto',
                                    }}
                                  >
                                    {chat.content}
                                  </Box>
                                ) : null}
                                {chat.type === 'image' ? (
                                  <Box mb={1} sx={{ overflow: 'hidden', lineHeight: '0px' }}>
                                    <a href={chat.content}><img src={chat.content} alt="attach" width="250" /></a>
                                  </Box>
                                ) : null}
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <Box
                            mb={1}
                            display="flex"
                            alignItems="flex-end"
                            flexDirection="row-reverse"
                          >
                            <Box alignItems="flex-end" display="flex" flexDirection={'column'}>
                              {chat.createdAt ? (
                                <Typography variant="body2" color="white" mb={1}>
                                  {formatDistanceToNowStrict(new Date(chat.createdAt), {
                                      addSuffix: false,
                                    })}{' '}
                                  ago
                                </Typography>
                              ) : null}
                              {chat.type === 'text' ? (
                                <Box
                                  mb={1}
                                  key={chat.id}
                                  sx={{
                                    p: 1,
                                    backgroundColor: 'primary.light',
                                    ml: 'auto',
                                  }}
                                >
                                  {chat.content}
                                </Box>
                              ) : null}
                              {chat.type === 'image' ? (
                                <Box mb={1} sx={{ overflow: 'hidden', lineHeight: '0px' }}>
                                  <a href={chat.content}><img src={chat.content} alt="attach" width="250" /></a>
                                </Box>
                              ) : null}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Scrollbar>
            </Box>

            {/* ------------------------------------------- */}
            {/* Chat right sidebar Content */}
            {/* ------------------------------------------- */}
            <ChatInsideSidebar isInSidebar={false} chat={chatDetails} />
          </Box>
          <ChatMsgSent />
        </Box>
        
      ) : (
        <Box display="flex" alignItems="center" p={2} pb={1} pt={1}>
          <></>
        </Box>
      )}
    </Box>
  );
};

export default ChatContent;
