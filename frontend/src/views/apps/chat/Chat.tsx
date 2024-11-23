// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Box, Theme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import ChatContent from 'src/components/apps/chats/ChatContent';
import ChatSidebar from 'src/components/apps/chats/ChatSidebar';
import PageContainer from 'src/components/container/PageContainer';

const Chats = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <PageContainer title="Чаты">
      <Box mt={2} display={"flex"} height={"85vh"} width={"100%"} bgcolor={"primary.contrastText"}>
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
        <Box width={"100%"}>
          <ChatContent toggleChatSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />
    
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Chats;
