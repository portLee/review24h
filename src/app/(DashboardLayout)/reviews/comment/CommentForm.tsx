import { Box, Button } from '@mui/material';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { useState } from 'react';

interface ICommentFormProps {
    id: number;
}

const CommentForm = ({id}: ICommentFormProps) => {
    const [comment, setComment] = useState('');

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/reviews/comments', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reviewId: id,
                    contents: comment
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            setComment('');
            alert('Comment submitted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to submit comment. Please try again');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <CustomTextField
                variant="outlined"
                multiline
                rows={6}
                placeholder="답변을 입력하세요"
                fullWidth
                value={comment}
                onChange={handleCommentChange}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="secondary">
                    취소
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    등록
                </Button>
            </Box>
        </Box>
    );
}

export default CommentForm;