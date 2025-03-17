import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button, CircularProgress, Box, Paper, Typography,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';

const API_BASE_URL = 'https://noco-erp.com/api/v2/tables/ms5mdxf53amdyeh/records';
const API_TOKEN = '45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c';

export default function EditDataLop() {
    const { classCode } = useParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hocVienList, setHocVienList] = useState([]);
    const [loadingHocVien, setLoadingHocVien] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalHocVienList, setModalHocVienList] = useState([]);
    const [loadingModal, setLoadingModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm

    // Hàm fetch dữ liệu lớp học
    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}?where=(classCode,eq,${encodeURIComponent(classCode)})`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': API_TOKEN,
                },
            });

            if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
            const data = await response.json();
            setRows(data.list || []);
            groupDataByClassCode(result.list || []); // Nhóm dữ liệu theo classCode
        } catch (error) {
            // enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu', { variant: 'error', autoHideDuration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    // Hàm fetch danh sách học viên trong lớp
    const fetchHocVienData = async () => {
        try {
            const response = await fetch(`https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records?where=(maLop,eq,${encodeURIComponent(classCode)})`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': API_TOKEN,
                },
            });

            if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu học viên');
            const data = await response.json();
            setHocVienList(data.list || []);
        } catch (error) {
            // enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu học viên', { variant: 'error', autoHideDuration: 2000 });
        } finally {
            setLoadingHocVien(false);
        }
    };

    // Hàm xóa học viên
    const handleDeleteHocVien = async (id) => {
        try {
            const response = await fetch(`https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': API_TOKEN,
                },
                body: JSON.stringify({ Id: id, maLop: '', lichHoc: '', ngayKhaiGiangDuKien: '', trangThaitrangThaiChonLop: 'HV Chưa chọn lịch' }), // Cập nhật maLop thành rỗng
            });

            if (!response.ok) throw new Error('Lỗi khi xóa học viên');
            enqueueSnackbar('Xóa học viên thành công', { variant: 'success', autoHideDuration: 2000 });
            fetchHocVienData(); // Cập nhật lại danh sách học viên
        } catch (error) {
            // enqueueSnackbar('Có lỗi xảy ra khi xóa học viên', { variant: 'error', autoHideDuration: 2000 });
        }
    };

    // Hàm mở modal và fetch danh sách học viên dựa trên sản phẩm và trình độ
    const handleOpenModal = async () => {
        setOpenModal(true);
        setLoadingModal(true);
        try {
            // Lấy thông tin sản phẩm và trình độ từ dữ liệu lớp học
            const currentClass = rows[0]; // Giả sử chỉ có một lớp học phù hợp
            const product = currentClass.product; // Thay 'sanPham' bằng tên trường thực tế
            const trinhDo = currentClass.trinhDo; // Thay 'trinhDo' bằng tên trường thực tế

            const response = await fetch(
                `https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records?where=(sanPham,eq,${encodeURIComponent(product)})~and(goiMua,eq,${encodeURIComponent(trinhDo)})&limit=25&shuffle=0&offset=0`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'xc-token': API_TOKEN,
                    },
                }
            );
            if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu học viên');
            const data = await response.json();
            setModalHocVienList(data.list || []);
        } catch (error) {
            // enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu học viên', { variant: 'error', autoHideDuration: 2000 });
        } finally {
            setLoadingModal(false);
        }
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Hàm thêm học viên vào lớp
    const handleAddHocVien = async (hocVien) => {
        try {
            const response = await fetch(`https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': API_TOKEN,
                },
                body: JSON.stringify({ Id: hocVien.Id, maLop: classCode, lichHoc: '', ngayKhaiGiangDuKien: rows[0].ngayKhaiGiangDuKien, trangThaiChonLop: "HV Chọn lịch hệ thống" }), // Cập nhật maLop
            });

            enqueueSnackbar('Thêm học viên thành công', { variant: 'success', autoHideDuration: 2000 });
            fetchHocVienData();
            handleCloseModal();
        } catch (error) {
            // enqueueSnackbar('Có lỗi xảy ra khi thêm học viên', { variant: 'error', autoHideDuration: 2000 });
        }
    };

    // Hàm tìm kiếm học viên
    const handleSearchHocVien = async (searchTerm) => {
        setLoadingModal(true);
        try {
            let apiUrl;
            if (searchTerm) {
                // Nếu có từ khóa tìm kiếm, fetch dữ liệu với điều kiện tìm kiếm
                apiUrl = `https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records?where=((maTheoDoi,eq,${encodeURIComponent(searchTerm)})~or(tenHocVien,eq,${encodeURIComponent(searchTerm)})~or(soDienThoaiHocVien,eq,${encodeURIComponent(searchTerm)})~or(emailHocVien,eq,${encodeURIComponent(searchTerm)}))~and(sanPham,eq,${encodeURIComponent(rows[0].product)})~and(goiMua,eq,${encodeURIComponent(rows[0].trinhDo)})&limit=25&shuffle=0&offset=0`;
            } else {
                // Nếu không có từ khóa tìm kiếm, fetch toàn bộ danh sách học viên
                apiUrl = `https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records?where=(sanPham,eq,${encodeURIComponent(rows[0].product)})~and(goiMua,eq,${encodeURIComponent(rows[0].trinhDo)})&limit=25&shuffle=0&offset=0`;
            }

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': API_TOKEN,
                },
            });
console.log(apiUrl);

            if (!response.ok) throw new Error('Lỗi khi tìm kiếm học viên');
            const data = await response.json();
            setModalHocVienList(data.list || []); // Cập nhật danh sách học viên trong modal
        } catch (error) {
            // enqueueSnackbar('Có lỗi xảy ra khi tìm kiếm học viên', { variant: 'error', autoHideDuration: 2000 });
        } finally {
            setLoadingModal(false);
        }
    };
    // Gọi fetchData và fetchHocVienData khi component được mount
    useEffect(() => {
        fetchData();
        fetchHocVienData();
    }, [classCode]);

    return (
        <SnackbarProvider maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MainCard>
                <Typography variant="h3" sx={{ marginBottom: 2 }} fontWeight="bold">
                    Thông tin chi tiết lớp: {classCode}
                </Typography>

                {/* Bảng thông tin lớp học */}
                <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell>Trình độ</TableCell>
                                        <TableCell>Mã lớp</TableCell>
                                        <TableCell>Mã giáo viên</TableCell>
                                        <TableCell>Tên giáo viên</TableCell>
                                        <TableCell>Ngày học</TableCell>
                                        <TableCell>Giờ bắt đầu</TableCell>
                                        <TableCell>Giờ kết thúc</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.Id}>
                                            <TableCell>{row.Id}</TableCell>
                                            <TableCell>{row.product}</TableCell>
                                            <TableCell>{row.trinhDo}</TableCell>
                                            <TableCell>{row.classCode}</TableCell>
                                            <TableCell>{row.maGiaoVien}</TableCell>
                                            <TableCell>{row.tenGiaoVien}</TableCell>
                                            <TableCell>{row.ngayHoc}</TableCell>
                                            <TableCell>{row.gioBatDau}</TableCell>
                                            <TableCell>{row.gioKetThuc}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Bảng danh sách học viên */}
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
                        <Typography variant="h4" fontWeight="bold">
                            Danh sách học viên
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleOpenModal}>
                            Chọn học viên
                        </Button>
                    </Box>

                    {loadingHocVien ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Mã học viên</TableCell>
                                        <TableCell>Tên học viên</TableCell>
                                        <TableCell>SDT học viên</TableCell>
                                        <TableCell>Email học viên</TableCell>
                                        <TableCell>Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {hocVienList.map((hocVien, index) => (
                                        <TableRow key={hocVien.Id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{hocVien.maTheoDoi}</TableCell>
                                            <TableCell>{hocVien.tenHocVien}</TableCell>
                                            <TableCell>{hocVien.soDienThoaiHocVien}</TableCell>
                                            <TableCell>{hocVien.emailHocVien}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDeleteHocVien(hocVien.Id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Modal chọn học viên */}
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                    <DialogTitle>Chọn học viên</DialogTitle>
                    <DialogContent>
                        {/* Ô input search */}
                        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Tìm kiếm theo mã, tên, số điện thoại hoặc email"
                                value={searchTerm}
                                onChange={(e) => {
                                    const newSearchTerm = e.target.value; // Lấy giá trị mới từ input
                                    setSearchTerm(newSearchTerm); // Cập nhật giá trị searchTerm
                                    handleSearchHocVien(newSearchTerm); // Gọi hàm tìm kiếm với giá trị mới
                                }}
                            />
                        </Box>

                        {loadingModal ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Mã học viên</TableCell>
                                            <TableCell>Tên học viên</TableCell>
                                            <TableCell>SDT học viên</TableCell>
                                            <TableCell>Email học viên</TableCell>
                                            <TableCell>Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {modalHocVienList.map((hocVien, index) => (
                                            <TableRow key={hocVien.Id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{hocVien.maTheoDoi}</TableCell>
                                                <TableCell>{hocVien.tenHocVien}</TableCell>
                                                <TableCell>{hocVien.soDienThoaiHocVien}</TableCell>
                                                <TableCell>{hocVien.emailHocVien}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleAddHocVien(hocVien)}
                                                    >
                                                        Thêm
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="secondary">
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Nút quay lại */}
                <Box sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => navigate('/data-lop')}>
                        Quay lại
                    </Button>
                </Box>
            </MainCard>
        </SnackbarProvider>
    );
}