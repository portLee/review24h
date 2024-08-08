import React, {useState} from "react";
import { signIn } from 'next-auth/react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    
      const response = await signIn("credentials", {
        email: email,
        password: password,
      });

      if(!response){
        console.log("로그인 요청 실패");
        return null;
      }else if(response.error){
        alert('정보가 일치하지 않습니다.');
        return;
      }else{
        console.log("로그인 성공");
      }
  };
  
  return(
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Stack>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="email"
          mb="5px"
        >
          Email
        </Typography>
        <CustomTextField id="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)}/>
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          Password
        </Typography>
        <CustomTextField id="password" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)}/>
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
        <Typography
          component={Link}
          href="/"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          아이디/비밀번호 찾기
        </Typography>
      </Stack>
    </Stack>
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        onClick={handleLogin}
        type="submit"
      >
        로그인
      </Button>
    </Box>
    <Box
     mt={3}
     pt={3} 
     borderTop="1px solid #b4b4b4"
     display="flex"
     justifyContent="space-evenly"
     >
      <Image src="/images/socials/kakao_login_medium_narrow.png" alt={"KakaoLoginBtn"} width={200} height={40}/>
      <Image src="/images/socials/naver_login_btn.png" alt={"NaverLoginBtn"} width={200} height={40}/>
    </Box>
    {subtitle}
  </>
  );
};

export default AuthLogin;
