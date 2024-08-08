import React from 'react';
import { Box, Typography, Button, FormControlLabel, Checkbox, LinearProgress } from '@mui/material';
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import { Stack } from '@mui/system';


const AuthRegister1 =({ title, subtitle, subtext, handleCheckboxChange, handleNext, formData }: RegisterFormProps & { handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <>
        
        
        {subtext}

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='email' mb="5px">사용자 약관 동의</Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.termsAccepted.term1}
                        onChange={handleCheckboxChange}
                        name="term1"
                        />
                    }
                    label="약관 1에 동의합니다."
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.termsAccepted.term2}
                        onChange={handleCheckboxChange}
                        name="term2"
                        />
                    }
                    label="약관 2에 동의합니다."
                    />
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={formData.termsAccepted.term3}
                        onChange={handleCheckboxChange}
                        name="term3"
                        />
                    }
                    label="약관 3에 동의합니다."
                />
            </Stack>
            <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext} disabled={!Object.values(formData.termsAccepted).every(Boolean)}>
                다음
            </Button>
        </Box>
        {subtitle}
    </>
);

export default AuthRegister1;
