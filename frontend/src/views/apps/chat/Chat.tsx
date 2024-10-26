// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import { Divider, Box, Grid, useMediaQuery, Theme } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ChatSidebar from 'src/components/apps/chats/ChatSidebar';
import ChatContent from 'src/components/apps/chats/ChatContent';
import ChatMsgSent from 'src/components/apps/chats/ChatMsgSent';
import AppCard from 'src/components/shared/AppCard';
import ChatListing from 'src/components/apps/chats/ChatListing';

const Chats = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <PageContainer title="Чаты">
      <Box display={"flex"} width={"100%"} sx={{margin:"0%"}}>
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}

        <ChatSidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />

        {/* <ChatListing /> */}
        {/* ------------------------------------------- */}
        {/* Right part */}
        {/* ------------------------------------------- */}
        <Box width={"100%"} sx={{height: '100%'}}>
          <ChatContent toggleChatSidebar={() => setMobileSidebarOpen(true)} />
          <Divider />
          <ChatMsgSent />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Chats;
