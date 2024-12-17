import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconSearch, IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Menuitems from '../sidebar/MenuItems';
import { AppState, useSelector } from 'src/store/Store';

interface menuType {
  title: string;
  id: string;
  subheader: string;
  children: menuType[];
  href: string;
}

const Search = () => {
  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);
  const [search, setSerach] = useState('');
  const customizer = useSelector((state: AppState) => state.customizer);

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  const filterRoutes = (rotr: any, cSearch: string) => {
    if (rotr.length > 1)
      return rotr.filter((t: any) =>
        t.title ? t.href.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()) : '',
      );

    return rotr;
  };
  const searchData = filterRoutes(Menuitems, search);

  return (
      <>
          <IconButton
              aria-label="show 4 new mails"
              color={customizer.activeMode === 'dark' ? "secondary": "inherit"}
              aria-controls="search-menu"
              aria-haspopup="true"
              onClick={() => setShowDrawer2(true)}
              size="large"
          >
              <IconSearch size="16" />
          </IconButton>
          <Dialog
              open={showDrawer2}
              onClose={() => setShowDrawer2(false)}
              fullWidth
              maxWidth={'sm'}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{ sx: { position: 'fixed', top: 30, m: 0 } }}
          >
              <DialogContent className="testdialog">
                  <Stack direction="row" spacing={2} alignItems="center">
                      <TextField
                          id="tb-search"
                          placeholder="Поиск"
                          fullWidth
                          onChange={(e) => setSerach(e.target.value)}
                          inputProps={{ 'aria-label': 'Поиск' }}
                      />
                      <IconButton size="small" onClick={handleDrawerClose2}>
                          <IconX size="18" />
                      </IconButton>
                  </Stack>
              </DialogContent>
              <Divider />
              <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                  <Typography variant="h5" p={1}>
                      Быстрые ссылки
                  </Typography>
                  <Box>
                      <List component="nav">
                          {searchData.map((menu: menuType) => {
                              return (
                                  <Box key={menu.title ? menu.id : menu.subheader}>
                                      {menu.title && !menu.children ? (
                                          <ListItemButton
                                              sx={{ py: 0.5, px: 1 }}
                                              to={menu?.href}
                                              component={Link}
                                          >
                                              <ListItemText
                                                  primary={menu.title}
                                                  sx={{ my: 0, py: 0.5 }}
                                              />
                                          </ListItemButton>
                                      ) : (
                                          ''
                                      )}
                                      {menu.children ? (
                                          <>
                                              {menu.children.map((child: menuType) => {
                                                  return (
                                                      <ListItemButton
                                                          sx={{ py: 0.5, px: 1 }}
                                                          to={child.href}
                                                          component={Link}
                                                          key={
                                                              child.title
                                                                  ? child.id
                                                                  : menu.subheader
                                                          }
                                                      >
                                                          <ListItemText
                                                              primary={child.title}
                                                              secondary={child.href}
                                                              sx={{ my: 0, py: 0.5 }}
                                                          />
                                                      </ListItemButton>
                                                  );
                                              })}
                                          </>
                                      ) : (
                                          ''
                                      )}
                                  </Box>
                              );
                          })}
                      </List>
                  </Box>
              </Box>
          </Dialog>
      </>
  );
};

export default Search;
