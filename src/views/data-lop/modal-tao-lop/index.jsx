import React, { useState, useEffect } from "react";
import {
    Modal, Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select,
    MenuItem, IconButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd'; import "react-datepicker/dist/react-datepicker.css";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';

const API_TOKEN = '45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c';
const API_GV_URL = 'https://noco-erp.com/api/v2/tables/msvdcv2b25ke6ha/records';

export default function AddModal({ open, onClose, fetchData }) {
    const [sanPham, setSanPham] = useState('');
    const [sizeLop, setSizeLop] = useState('');
    const [loaiGiaoVien, setLoaiGiaoVien] = useState('');
    const [ngayKhaiGiangDuKien, setNgayKhaiGiangDuKien] = useState('');
    const [soBuoi, setSoBuoi] = useState('');
    const [trinhDo, setTrinhDo] = useState('');
    const [trinhDoOptions, setTrinhDoOptions] = useState([]);
    const [maLop, setMaLop] = useState('');
    const [sanPhamOptions, setSanPhamOptions] = useState([
        'ICC.SpeakWell', 'ICC.EasyPASS', 'ICC.EasyIELTS', 'IOA', 'Easy IELTS Video', 'Freetalk',
        'English Adventure with Milo', 'Easy Speak For Adults',
        'Easy Speak', 'Sách Kid\'s Box 4', 'Sách Kid\'s Box 3', 'IELTS Face Off (IFO)'
    ]);
    const [sizeLopOptions, setSizeLopOptions] = useState(['1:1', '1:2', '1:4', '1:6', '1:8']);
    const [loaiGiaoVienOptions, setLoaiGiaoVienOptions] = useState(['Việt Nam', 'Philippines', 'Nam Phi', 'US/UK', 'Mix']);
    const [lichHoc, setLichHoc] = useState([{ ngay: 'Thứ 2', gioBatDau: '00:00', gioKetThuc: '00:00', giaoVien: null }]);
    const [openGiaoVienModal, setOpenGiaoVienModal] = useState(false);
    const [giaoVienList, setGiaoVienList] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [selectedLichHocIndex, setSelectedLichHocIndex] = useState(null);
    const PAGE_SIZE = 25;
    const [searchTerm, setSearchTerm] = useState('');
    const resetMainModalInternal = () => {
        setSanPham('');
        setSizeLop('');
        setLoaiGiaoVien('');
        setTrinhDo('');
        setNgayKhaiGiangDuKien('');
        setSoBuoi('');
        setMaLop('');
        setLichHoc([{ ngay: 'Thứ 2', gioBatDau: '00:00', gioKetThuc: '00:00' }]);
        setTrinhDoOptions([]);
        setSearchTerm('');
        setPage(0);
    };
    const handleCloseMainModal = () => {
        resetMainModalInternal(); // Reset các state trong modal
        onClose(); // Gọi hàm onClose từ props để đóng modal
    };
    // Hàm tạo mã lớp ngẫu nhiên
    const generateRandomNumber = (length) => {
        return Math.floor(Math.pow(10, length - 1) + Math.floor(Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))), length);
    };

    // Hàm tạo mã lớp
    const generateMaLop = async (kiHieuSanPham, kiHieuTrinhDo) => {
        let maLop;
        let isUnique = false;

        while (!isUnique) {
            const randomNumber = generateRandomNumber(10 - kiHieuSanPham.length - (kiHieuTrinhDo ? kiHieuTrinhDo.length : 0));
            maLop = kiHieuSanPham + (kiHieuTrinhDo || '') + randomNumber;

            // Kiểm tra xem mã lớp đã tồn tại chưa
            const response = await fetch(`https://noco-erp.com/api/v2/tables/ms5mdxf53amdyeh/records?where=(classCode,eq,${encodeURIComponent(maLop)})`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': API_TOKEN
                }
            });

            const data = await response.json();
            if (data.list && data.list.length === 0) {
                isUnique = true;
            }
        }

        return maLop;
    };

    // Hàm cập nhật mã lớp khi sản phẩm hoặc trình độ thay đổi
    const updateMaLop = async () => {
        if (sanPham) {
            const response = await fetch(`https://noco-erp.com/api/v2/tables/m4lvj2xnrjb37zd/records?where=(sanPham,eq,${encodeURIComponent(sanPham)})`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': API_TOKEN
                }
            });

            const data = await response.json();
            if (data.list && data.list.length > 0) {
                const kiHieuSanPham = data.list[0].kiHieuSanPham;
                const kiHieuTrinhDo = trinhDo ? data.list.find(item => item.trinhDo === trinhDo)?.kiHieuTrinhDo : '';

                const newMaLop = await generateMaLop(kiHieuSanPham, kiHieuTrinhDo);
                setMaLop(newMaLop);
            }
        }
    };

    useEffect(() => {
        if (sanPham) {
            fetch(`https://noco-erp.com/api/v2/tables/m4lvj2xnrjb37zd/records?where=(sanPham,eq,${encodeURIComponent(sanPham)})`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': API_TOKEN
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.list && data.list.length > 0) {
                        const trinhDoList = data.list.map(item => item.trinhDo);
                        setTrinhDoOptions(trinhDoList);
                        setTrinhDo(trinhDoList[0]);
                    } else {
                        setTrinhDoOptions([]);
                        setTrinhDo('');
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            setTrinhDoOptions([]);
            setTrinhDo('');
        }
    }, [sanPham]);

    useEffect(() => {
        updateMaLop();
    }, [sanPham, trinhDo]);

    const handleThemLichHoc = () => {
        setLichHoc([...lichHoc, { ngay: 'Thứ 2', gioBatDau: '00', phutBatDau: '00', gioKetThuc: '00', phutKetThuc: '00', giaoVien: null }]);
    };

    const handleChangeLichHoc = (index, field, value) => {
        const newLichHoc = [...lichHoc];
        newLichHoc[index][field] = value;
        setLichHoc(newLichHoc);
    };

    const handleXoaLichHoc = (index) => {
        const newLichHoc = lichHoc.filter((_, i) => i !== index);
        setLichHoc(newLichHoc);
    };
    const resetGiaoVienModal = () => {
        setGiaoVienList([]); // Reset danh sách giáo viên
        setSearchTerm(''); // Reset từ khóa tìm kiếm
        setPage(0); // Reset về trang đầu tiên
    };

    const handleOpenGiaoVienModal = (index) => {
        setSelectedLichHocIndex(index); // Lưu index của lịch học đang được chọn
        setOpenGiaoVienModal(true);
        fetchGiaoVienList();
    };

    const handleCloseGiaoVienModal = () => {
        resetGiaoVienModal(); // Reset các state liên quan đến giáo viên
        setSelectedLichHocIndex(null); // Reset index của lịch học đang được chọn
        setOpenGiaoVienModal(false); // Đóng modal
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset về trang đầu tiên khi tìm kiếm
        fetchGiaoVienList(event.target.value); // Gọi API với từ khóa tìm kiếm
    };

    const fetchGiaoVienList = async (currentPage) => {
        const offset = (currentPage - 1) * PAGE_SIZE;

        let conditions = [];

        if (searchTerm) {
            let searchConditions = [
                `(maGiaoVien,anyof,${encodeURIComponent(searchTerm)})`,
                `(tenGiaoVien,eq,${encodeURIComponent(searchTerm)})`
            ];
            conditions.push(`${searchConditions.join("~or")}`);
        }
        // if (statusFilter) {
        //     conditions.push(`(trangThaiChamSoc,eq,${encodeURIComponent(statusFilter)})`);
        // }
        // if (productFilter) {
        //     conditions.push(`(sanPham,eq,${encodeURIComponent(productFilter)})`);
        // }
        const whereQuery = conditions.length > 0 ? `where=${conditions}&` : '';
        const url = `${API_GV_URL}?${whereQuery}limit=${PAGE_SIZE}&shuffle=0&offset=${offset}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'xc-token': API_TOKEN },
            });
            console.log(url);
            if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');

            const data = await response.json();
            console.log("API response:", data.list); // Debug API response

            if (data?.list && data?.pageInfo?.totalRows !== undefined) {
                setGiaoVienList(data.list);
                console.log("GiaoVienList:", giaoVienList);

                setTotalRows(data.pageInfo.totalRows);
            } else {
                setGiaoVienList([]);
                setTotalRows(0);
            }
        } catch (error) {
            console.log("Fetching URL:", url);

            console.error('Lỗi:', error);
            setGiaoVienList([]);
            setTotalRows(0);
        }
    };

    useEffect(() => {
        if (openGiaoVienModal) {
            fetchGiaoVienList(page);
        }
    }, [page, searchTerm, openGiaoVienModal]);
    const handleTaoLop = async () => {
        if (!validateForm()) return;

        try {
            // Duyệt qua từng lịch học và gửi dữ liệu lên API
            for (const lich of lichHoc) {
                // const [gioBatDau, phutBatDau] = lich.gioBatDau.split(':');
                // const [gioKetThuc, phutKetThuc] = lich.gioKetThuc.split(':');
                const body = {
                    classCode: maLop,
                    product: sanPham,
                    size: sizeLop,
                    teacherType: loaiGiaoVien,
                    trinhDo: trinhDo,
                    soBuoi: document.querySelector('input[name="soBuoi"]').value, // Lấy giá trị từ input
                    ngayKhaiGiangDuKien: document.querySelector('input[name="ngayKhaiGiangDuKien"]').value, // Lấy giá trị từ input
                    ngayHoc: lich.ngay,
                    gioBatDau: lich.gioBatDau,
                    gioKetThuc: lich.gioKetThuc,
                    maGiaoVien: lich.giaoVien ? lich.giaoVien.maGiaoVien : '',
                    tenGiaoVien: lich.giaoVien ? lich.giaoVien.tenGiaoVien : '',
                    soSlotBooking: 0, // Giá trị mặc định
                    soSlotChuyenKhoa: 0, // Giá trị mặc định
                    soDaDangKy: 0, // Giá trị mặc định
                };

                const response = await fetch('https://noco-erp.com/api/v2/tables/ms5mdxf53amdyeh/records', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xc-token': API_TOKEN,
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) throw new Error('Lỗi khi gửi dữ liệu lên API');
            }

            enqueueSnackbar('Tạo lớp thành công!', { variant: 'success', autoHideDuration: 2000 });

            handleCloseMainModal();
            if (fetchData) {
                fetchData();
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const validateForm = () => {
        if (!sanPham || !sizeLop || !loaiGiaoVien || !trinhDo || !soBuoi || !ngayKhaiGiangDuKien || !ngayKhaiGiangDuKien || !maLop || lichHoc.length === 0) {
            enqueueSnackbar('Vui lòng điền đầy đủ thông tin lớp học!', { variant: 'error', autoHideDuration: 2000 });

            return false;
        }
        return true;
    };
    return (
        <Modal
            open={open}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") handleCloseMainModal();
            }}
        >
            <Box
                sx={{
                    width: 1000,
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
                        <TextField name="classCode" fullWidth sx={{ mb: 2 }} value={maLop} disabled />

                        <Typography>Sản phẩm</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select
                                value={sanPham}
                                onChange={(e) => setSanPham(e.target.value)}
                                label="Sản phẩm"
                            >
                                {sanPhamOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography>Size Lớp</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select
                                value={sizeLop}
                                onChange={(e) => setSizeLop(e.target.value)}
                            >
                                {sizeLopOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography>Loại Giáo Viên</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select
                                value={loaiGiaoVien}
                                onChange={(e) => setLoaiGiaoVien(e.target.value)}
                                label="Loại Giáo Viên"
                            >
                                {loaiGiaoVienOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                    </Grid>

                    {/* Cột 2 */}
                    <Grid item xs={6}>
                        <Typography>Trình Độ</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select
                                value={trinhDo}
                                onChange={(e) => setTrinhDo(e.target.value)}
                                label="Trình Độ"
                            >
                                {trinhDoOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography>Số Buổi</Typography>
                        <TextField name="soBuoi" fullWidth sx={{ mb: 2 }} onChange={(e) => setSoBuoi(e.target.value)} />

                        <Typography>Ngày Khai Giảng Dự Kiến</Typography>
                        <TextField type='date' name="ngayKhaiGiangDuKien" fullWidth sx={{ mb: 2 }} onChange={(e) => setNgayKhaiGiangDuKien(e.target.value)} />

                    </Grid>
                </Grid>

                {/* Lịch học */}
                <Box sx={{ mt: 4 }}>
                    <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Grid item>
                            <Typography variant="h6">Lịch Học</Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={handleThemLichHoc}>
                                + Lịch học
                            </Button>
                        </Grid>
                    </Grid>
                    {lichHoc.map((lich, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }} alignItems="center" flexWrap="nowrap">
                            <Grid item xs={2}>
                                <FormControl fullWidth>
                                    <Select
                                        value={lich.ngay}
                                        onChange={(e) => handleChangeLichHoc(index, 'ngay', e.target.value)}
                                    >
                                        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((ngay, i) => (
                                            <MenuItem key={i} value={ngay}>{ngay}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    fullWidth
                                    label="Giờ bắt đầu"
                                    value={lich.gioBatDau}
                                    onChange={(e) => handleChangeLichHoc(index, 'gioBatDau', e.target.value)}
                                    type="time"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    fullWidth
                                    label="Giờ kết thúc"
                                    value={lich.gioKetThuc}
                                    onChange={(e) => handleChangeLichHoc(index, 'gioKetThuc', e.target.value)}
                                    type="time"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <TextField
                                        fullWidth
                                        value={lich.giaoVien ? `${lich.giaoVien.maGiaoVien} - ${lich.giaoVien.tenGiaoVien}` : ''}
                                        disabled
                                        label="Giáo viên"
                                        variant="outlined"
                                    />
                                    <IconButton onClick={() => handleOpenGiaoVienModal(index)}>
                                        <GroupAddIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleXoaLichHoc(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    ))}
                </Box>

                {/* Nút hành động */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button variant="contained" color="primary" onClick={handleTaoLop}>
                        Tạo Lớp
                    </Button>
                    <Button variant="outlined" onClick={handleCloseMainModal}>
                        Đóng
                    </Button>
                </Box>
                {/* Modal chọn giáo viên */}
                <Modal
                    open={openGiaoVienModal}
                    onClose={handleCloseGiaoVienModal}
                    BackdropProps={{ style: { backgroundColor: "transparent" } }}
                >
                    <Box sx={{
                        width: 800, // Chiều rộng mặc định
                        height: 700, // Chiều cao mặc định
                        bgcolor: 'white',
                        p: 3,
                        mx: 'auto',
                        mt: '10vh',
                        borderRadius: 2,
                        overflowY: 'auto', // Cho phép cuộn nếu nội dung dài
                        boxShadow: 24, // Đổ bóng để modal nổi bật
                    }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                            Danh sách giáo viên
                        </Typography>

                        <TextField
                            fullWidth
                            label="Tìm kiếm giáo viên"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearch}
                            sx={{ mb: 2 }}
                        />

                        <TableContainer component={Paper} sx={{ width: '100%', maxHeight: 400, overflowY: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Mã GV</TableCell>
                                        <TableCell>Quốc tịch</TableCell>
                                        <TableCell>Giới tính</TableCell>
                                        <TableCell>Tên GV</TableCell>
                                        <TableCell>Chọn</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {giaoVienList.map((gv, index) => (
                                        <TableRow key={gv.Id}>
                                            <TableCell>{index + 1 + page * PAGE_SIZE}</TableCell>
                                            <TableCell>{gv.maGiaoVien}</TableCell>
                                            <TableCell>{gv.quocTich}</TableCell>
                                            <TableCell>{gv.gioiTinh}</TableCell>
                                            <TableCell>{gv.tenGiaoVien}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => {
                                                        const newLichHoc = [...lichHoc];
                                                        newLichHoc[selectedLichHocIndex].giaoVien = gv; // Cập nhật giáo viên cho lịch học
                                                        setLichHoc(newLichHoc);
                                                        handleCloseGiaoVienModal(); // Đóng modal
                                                    }}
                                                >
                                                    Chọn
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Phân trang đặt bên ngoài TableContainer để không bị cuộn theo bảng */}
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 50]}
                            component="div"
                            count={totalRows}
                            rowsPerPage={PAGE_SIZE}
                            page={page}
                            onPageChange={(event, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(event) => {
                                setPage(0);
                                setPAGE_SIZE(parseInt(event.target.value, 10));
                            }}
                        />


                        <Button onClick={handleCloseGiaoVienModal} sx={{ mt: 2 }} fullWidth variant="outlined">
                            Đóng
                        </Button>
                    </Box>
                </Modal>
            </Box >

        </Modal >
    );
}