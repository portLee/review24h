'use client'
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';

const AuthRegister3 = ({ subtitle, subtext, handleChange, handlePrev, formData }: RegisterFormProps ) => {
    
    
    const handleSubmit = async () => {
        
        try {
          // 서버에 POST 요청 보내기
          const response = await fetch('/api/auth/signUp', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          })
          const data = await response.json();
          if(!response.ok){
            alert('중복오류가 발생했습니다. 다시 시도해주세요.');
          }else{
           window.location.href= '/authentication/login';
          }
        } catch (error) {
          // 에러가 발생한 경우
          console.error('Registration error:', error);
          // 사용자에게 에러 메시지를 표시하거나, 추가적인 에러 처리를 할 수 있습니다.
          alert('회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      };

    return(
        <>
    
        {subtext}

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='baminID' mb="5px" mt="25px">배달의민족 아이디</Typography>
                <CustomTextField id="baminID" variant="outlined" fullWidth value={formData.baminId} onChange={handleChange} />

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='baminPW' mb="5px" mt="25px">배달의민족 비밀번호</Typography>
                <CustomTextField id="baminPW" type="password" variant="outlined" fullWidth onChange={handleChange}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='validBaminPW' mb="5px" mt="25px">배달의민족 비밀번호 확인</Typography>
                <CustomTextField id="validBaminPW" type="password" variant="outlined" fullWidth onChange={handleChange}/>
            </Stack>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: 2, 
                }}>
                <Button color="error" variant="contained" size="large" fullWidth onClick={handlePrev}>
                    이전
                </Button>
                <Button color="primary" variant="contained" size="large" fullWidth onClick={handleSubmit}>
                    회원가입 완료
                </Button>
            </Box>
        </Box>
        {subtitle}
    </>
    );
};

export default AuthRegister3;


