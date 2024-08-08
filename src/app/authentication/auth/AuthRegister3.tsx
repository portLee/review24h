import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link  from 'next/link';
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';

interface registerType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
  }

const AuthRegister3 = ({ title, subtitle, subtext, handleNext, handleChange, handlePrev, formData }: RegisterFormProps ) => (
    <>
        

        {subtext}

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='baminId' mb="5px" mt="25px">배달의민족 아이디</Typography>
                <CustomTextField id="baminId" variant="outlined" fullWidth value={formData.baminId} onChange={handleChange} />

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='baminPw' mb="5px" mt="25px">배달의민족 비밀번호</Typography>
                <CustomTextField id="baminPw" variant="outlined" fullWidth onChange={handleChange}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='validBaminPw' mb="5px" mt="25px">배달의민족 비밀번호 확인</Typography>
                <CustomTextField id="validBaminPw" variant="outlined" fullWidth onChange={handleChange}/>
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

export default AuthRegister3;
