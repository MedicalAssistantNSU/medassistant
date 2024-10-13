import { useState } from 'react';
import { Box, Menu, Typography, Button, Divider, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconChevronDown, IconHelp } from '@tabler/icons-react';
import AppLinks from './AppLinks';
import QuickLinks from './QuickLinks';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

const AppDD = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <>
      <Box>
        {/* ------------------------------------------- */}
        {/* Message Dropdown */}
        {/* ------------------------------------------- */}
      </Box>
    </>
  );
};

export default AppDD;
