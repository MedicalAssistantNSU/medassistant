// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Box, Theme, useMediaQuery } from '@mui/material';
import React from 'react';
import ChatListing from './ChatListing';

interface chatType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
}

const ChatSidebar = ({ isMobileSidebarOpen, onSidebarClose }: chatType) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <Box
      onClick={onSidebarClose}
    >
      {isMobileSidebarOpen || lgUp == true ? 
      <Box width={"100%"}>
        <ChatListing />
      </Box> 
      : <></>}
    </Box>
  );
};

export default ChatSidebar;
