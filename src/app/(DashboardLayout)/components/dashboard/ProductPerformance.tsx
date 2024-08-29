
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Chip
} from '@mui/material';
import { StarRounded } from '@mui/icons-material';
import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import CommentForm from '../../reviews/comment/CommentForm';
import { useState, useEffect } from 'react';

const URL = 'http://localhost:3000/api/reviews';

const formatDate = (id: string): string => {
    const year = id.slice(0, 4);
    const month = id.slice(4, 6);
    const day = id.slice(6, 8);
    return `${year}-${month}-${day}`;
}

const StarRating = (rating: number) => {
    const totalStars = 5;
    return (
        <Box sx={{ display: 'flex' }}>
            {[...Array(totalStars)].map((_, index) => (
                    <StarRounded key={index} style={ index < rating ? { color: 'gold' } : {color: 'lightGray'}} />
            ))}
        </Box>
    );
};

const ProductPerformance = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const json = await response.json();
                setReviews(json);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    console.log(reviews);

    return (

        <DashboardCard title="리뷰 관리">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    번호
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    작성자
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    작성일자
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    리뷰내용
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    답글
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((review, index) => (
                            <TableRow key={review.id}>
                                <TableCell 
                                    sx={{
                                        verticalAlign: 'top'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {index + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        verticalAlign: 'top'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {review.memberNickname}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "13px",
                                                }}
                                            >
                                                {StarRating(review.rating)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        verticalAlign: 'top'
                                    }}
                                >
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                        {formatDate(review.id.toString())}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        verticalAlign: 'top',
                                        width: '50%'
                                    }}
                                >
                                    <Typography 
                                        color="textSecondary" 
                                        variant="subtitle2" 
                                        sx={{ 
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            whiteSpace: 'pre-line', 
                                        }}
                                    >
                                        {review.contents}
                                    </Typography>

                                    {review.menus && review.menus.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                주문내역
                                            </Typography>
                                            {review.menus.map((menu, index) => (
                                                <Typography key={index} color="textSecondary" variant="body2">
                                                    {menu.name} {/* 각 주문 내역 */}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}

                                    {review.deliveryReviews && (
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                배달리뷰
                                            </Typography>
                                            <Typography color="textSecondary" variant="body2">
                                                {review.deliveryReviews.recommendation} {/* 배달리뷰 */}
                                            </Typography>
                                        </Box>
                                    )}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        verticalAlign: 'top',
                                        width: '50%'
                                    }}
                                >
                                    <CommentForm id={review.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
