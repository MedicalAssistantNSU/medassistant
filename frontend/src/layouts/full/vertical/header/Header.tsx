import { AppBar, Box, IconButton, Stack, Toolbar, styled, useMediaQuery } from '@mui/material';

import { useDispatch, useSelector } from 'src/store/Store';
import { toggleMobileSidebar, toggleSidebar } from 'src/store/customizer/CustomizerSlice';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconMenu2 } from '@tabler/icons-react';
import { AppState } from 'src/store/Store';
import Customizer from '../../shared/customizer/Customizer';
import Navigation from './Navigation';
import Profile from './Profile';
import Search from './Search';

const Header = () => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const lgDown = useMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.primary.light,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
      <AppBarStyled position="sticky" color="default">
          <ToolbarStyled>
              {/* ------------------------------------------- */}
              {/* Toggle Button Sidebar */}
              {/* ------------------------------------------- */}
              <IconButton
                  color="inherit"
                  aria-label="menu"
                  onClick={
                      lgUp ? () => dispatch(toggleSidebar()) : () => dispatch(toggleMobileSidebar())
                  }
              >
                  <IconMenu2 size="20" />
              </IconButton>

              {/* ------------------------------------------- */}
              {/* Search Dropdown */}
              {/* ------------------------------------------- */}
              <Search />
              {lgUp ? (
                  <>
                      <Navigation />
                  </>
              ) : null}

              <Box flexGrow={1} />
              <Customizer />
              <Stack spacing={1} direction="row" alignItems="center">
                  <Profile />
              </Stack>
          </ToolbarStyled>
      </AppBarStyled>
  );
};

export default Header;
