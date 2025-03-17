import { useEffect, useRef, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { IconLogout, IconSettings } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import User1 from 'assets/images/users/user-round.svg';

export default function ProfileSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const anchorRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log("Stored user:", storedUser); // Kiểm tra giá trị trong localStorage
  
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/pages/login');
  };
console.log(user);

  return (
    <>
      <Avatar 
        src={User1} 
        alt="user-avatar"
        sx={{ cursor: 'pointer' }}
        ref={anchorRef}
        onClick={handleToggle}
      />
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false}>
                    <Box sx={{ p: 2 }}>
                      <Stack>
                        <Typography variant="h4">Xin chào, {user ? user.maNhanVien : 'Guest'}</Typography>
                        <Typography variant="subtitle2">{user?.role || 'User'}</Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <List>
                        <ListItemButton>
                          <ListItemIcon><IconSettings stroke={1.5} size="20px" /></ListItemIcon>
                          <ListItemText primary="Cài đặt tài khoản" />
                        </ListItemButton>
                        <ListItemButton onClick={handleLogout}>
                          <ListItemIcon><IconLogout stroke={1.5} size="20px" /></ListItemIcon>
                          <ListItemText primary="Đăng xuất" />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
