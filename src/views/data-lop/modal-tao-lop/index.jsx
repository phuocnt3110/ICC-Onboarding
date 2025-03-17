import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField, Grid } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function AddModal({ open, onClose }) {
    return (
        <Modal
            open={open}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") onClose();
            }}
        >
            <Box
                sx={{
                    width: 800,
                    bgcolor: 'white',
                    p: 4,
                    mx: 'auto',
                    mt: '10vh',
                    borderRadius: 2,
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#61019b'
                    }}
                >
                    Tạo Lớp Mới
                </Typography>


                <Grid container spacing={3}>
                    {/* Cột 1 */}
                    <Grid item xs={6}>
                        <Typography>Mã Lớp</Typography>
                        <TextField name="classCode" fullWidth sx={{ mb: 2 }} />

                        <Typography>Sản phẩm</Typography>
                        <TextField name="product" fullWidth sx={{ mb: 2 }} />

                        <Typography>Size Lớp</Typography>
                        <TextField name="size" fullWidth sx={{ mb: 2 }} />

                        <Typography>Loại Giáo Viên</Typography>
                        <TextField name="teacherType" fullWidth sx={{ mb: 2 }} />

                        <Typography>Trình Độ</Typography>
                        <TextField name="trinhDo" fullWidth sx={{ mb: 2 }} />

                        <Typography>Số Buổi</Typography>
                        <TextField name="soBuoi" fullWidth sx={{ mb: 2 }} />
                    </Grid>

                    {/* Cột 2 */}
                    <Grid item xs={6}>
                        <Typography>Ngày Khai Giảng Dự Kiến</Typography>
                        <TextField type='date' name="ngayKhaiGiangDuKien" fullWidth sx={{ mb: 2 }} />

                        <Typography>Ngày Học</Typography>
                        <TextField name="ngayHoc" fullWidth sx={{ mb: 2 }} />

                        <Typography>Giờ Bắt Đầu</Typography>
                        <TextField type="time" name="gioKetThuc" fullWidth sx={{ mb: 2 }} />

                        <Typography>Giờ Kết Thúc</Typography>
                        <TextField type="time" name="gioKetThuc" fullWidth sx={{ mb: 2 }} />


                    </Grid>
                </Grid>

                {/* Nút hành động */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button variant="contained" color="primary">
                        Tạo Lớp
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Đóng
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
