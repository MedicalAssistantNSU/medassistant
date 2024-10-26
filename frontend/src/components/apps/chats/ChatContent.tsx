// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {
  Typography,
  Divider,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Stack,
  useMediaQuery,
  Theme
} from '@mui/material';
import { IconChevronLeft, IconDotsVertical, IconMenu2 } from '@tabler/icons-react';
import { useSelector } from 'src/store/Store';

import { ChatsType } from 'src/types/apps/chat';
import { formatDistanceToNowStrict } from 'date-fns';
import ChatInsideSidebar from './ChatInsideSidebar';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import ChatListing from './ChatListing';


interface ChatContentProps {
  toggleChatSidebar: () => void;
}

  const ChatContent: React.FC<ChatContentProps> = ({ toggleChatSidebar }) => {
  const [open, setOpen] = React.useState(true);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

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
          <Box>
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

            <Box width="100%">
              <Scrollbar sx={{ height: '650px', overflow: 'auto', maxHeight: '800px' }}>
                <Box p={3}>
                  {chatDetails.messages.map((chat) => {
                    return (
                      <Box key={chat.id + chat.msg + chat.createdAt}>
                        {chatDetails.id === chat.senderId ? (
                          <>
                            <Box display="flex">
                              <Box>
                                {chat.createdAt ? (
                                  <Typography variant="body2" color="grey.400" mb={1}>
                                    {chatDetails.name},{' '}
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
                                    {chat.msg}
                                  </Box>
                                ) : null}
                                {chat.type === 'image' ? (
                                  <Box mb={1} sx={{ overflow: 'hidden', lineHeight: '0px' }}>
                                    <img src={chat.msg} alt="attach" width="150" />
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
                                <Typography variant="body2" color="grey.400" mb={1}>
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
                                  {chat.msg}
                                </Box>
                              ) : null}
                              {chat.type === 'image' ? (
                                <Box mb={1} sx={{ overflow: 'hidden', lineHeight: '0px' }}>
                                  <img src={chat.msg} alt="attach" width="250" />
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
        </Box>
      ) : (
        <Box display="flex" alignItems="center" p={2} pb={1} pt={1}>
          <ChatListing />
        </Box>
      )}
    </Box>
  );
};

export default ChatContent;
