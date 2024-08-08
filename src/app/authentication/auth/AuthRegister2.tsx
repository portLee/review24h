import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link  from 'next/link';
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';

const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');

    // 형식화된 전화번호 반환
    if (numbers.length <= 3) {
        return numbers;
    } else if (numbers.length <= 7) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
};

const AuthRegister2 = ({ title, subtitle, subtext, handleNext, handleChange, handlePrev, formData }: RegisterFormProps) => {
       
    const [phone, setPhone] = useState(formData.phone);

    // 전화번호 변경 핸들러
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        // 전화번호 형식화
        const formattedPhone = formatPhoneNumber(value);
        // 상태 업데이트
        setPhone(formattedPhone);
        // formData를 업데이트
        handleChange({
            target: {
                id: 'phone',
                value: formattedPhone,
            },
        });
    };
    
    return (
    <>
        {subtext}

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='email' mb="5px">이메일</Typography>
                <CustomTextField id="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">비밀번호</Typography>
                <CustomTextField id="password" type="password" variant="outlined" fullWidth value={formData.password} onChange={handleChange}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='validPassword' mb="5px" mt="25px">비밀번호 확인</Typography>
                <CustomTextField id="validPassword" type="password" variant="outlined" fullWidth onChange={handleChange}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='name' mb="5px" mt="25px">이름</Typography>
                <CustomTextField id="name" variant="outlined" fullWidth value={formData.name} onChange={handleChange}/>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='phone' mb="5px" mt="25px">전화번호</Typography>
                <CustomTextField id="phone" variant="outlined" fullWidth value={formData.phone} onChange={handlePhoneChange}/>
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
};

export default AuthRegister2;
