// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Box, Drawer, Theme, useMediaQuery } from '@mui/material';
import ChatListing from './ChatListing';

interface chatType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
}

const drawerWidth = 320;

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
