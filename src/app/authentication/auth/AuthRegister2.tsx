import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link  from 'next/link';
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';


const AuthRegister2 = ({ title, subtitle, subtext, handleNext, handleChange, handlePrev, formData }: RegisterFormProps) => (
    <>
        

        {subtext}

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='email' mb="5px">이메일</Typography>
                <CustomTextField id="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">비밀번호</Typography>
                <CustomTextField id="password" variant="outlined" fullWidth value={formData.password} onChange={handleChange}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='validPassword' mb="5px" mt="25px">비밀번호 확인</Typography>
                <CustomTextField id="validPassword" variant="outlined" fullWidth onChange={handleChange}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='name' mb="5px" mt="25px">이름</Typography>
                <CustomTextField id="name" variant="outlined" fullWidth value={formData.name} onChange={handleChange}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='phone' mb="5px" mt="25px">전화번호</Typography>
                <CustomTextField id="phone" variant="outlined" fullWidth value={formData.phone} onChange={handleChange}/>
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
                <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
                    다음
                </Button>
            </Box>
            
        </Box>
        {subtitle}
    </>
);

export default AuthRegister2;
