import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { jwtDecode } from 'jwt-decode';

interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => { 

  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // 액세스토큰 로컬 스토리지 저장 및 자동갱신 
  const session = useSession();
  
  if(session.status === 'authenticated'){
    const checkTokenExpiry = async () => {
      const accessToken = session.data.user.accessToken;

      // 액세스 토큰이 존재하면 로컬 스토리지에 저장
      if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      }
      
      let LSAT = localStorage.getItem('accessToken');
      if (LSAT) {
          const decoded = jwtDecode(LSAT);
          const at_ex = decoded.exp; // 액세스 토큰 만료 시간
          const currentTime = Math.floor(Date.now() / 1000); // 현재 시간

          // 액세스 토큰 만료 5분 전인지 확인
          if ((at_ex - currentTime) <= 5 * 60) {
              console.log("만료 5분 전");

              try {
                  const response = await fetch('/api/auth/token', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ accessToken: LSAT }),
                      credentials: 'include',
                  });
                  if(!response.ok){
                      const errorData = await response.json();
                      console.error(errorData);

                      handleLogout();
                      return;
                  }
                  const data = await response.json();

                  if (data.accessToken) {
                      localStorage.setItem('accessToken', data.accessToken);
                      console.log('새 액세스 토큰:', data.accessToken);

                      // 새 액세스 토큰으로 갱신된 시간 확인
                      LSAT = data.accessToken; // 갱신된 액세스 토큰으로 업데이트
                      
                      session.update({accessToken: data.accessToken});
                      
                  } else {
                      console.log("새로운 토큰을 발급 받을 수 없습니다.");
                  }
              } catch (error) {
                  console.error('토큰 갱신 오류:', error);
                  handleLogout();
              };
            };
          };
    };

    checkTokenExpiry();
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    
    fetch('/api/auth/logout',{
        method:'POST',
    })
    signOut();
  };

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>


        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>

        </IconButton>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Button variant="contained" component={Link} href="/authentication/login"   disableElevation color="primary" >
            Login
          </Button>
          <Button variant="contained" onClick={handleLogout} disableElevation color="primary" >
            LogOut
          </Button>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
