import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, TablePagination, IconButton, TextField, Select, MenuItem,
    FormControl, InputLabel, Box, Typography
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { IconRefresh, IconList } from '@tabler/icons-react';
import AddModal from './modal-tao-lop';
const API_BASE_URL = 'https://noco-erp.com/api/v2/tables/ms5mdxf53amdyeh/records';
const API_TOKEN = '45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c';
const PAGE_SIZE = 50;

export default function DataLop() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [checkedItems, setCheckedItems] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const navigate = useNavigate();
    // State để điều khiển modal
    const [openModal, setOpenModal] = useState(false);

    const statusOptions = [
        'Đã khai giảng',
        'Dự kiến khai giảng',
        'Chốt khai giảng',
        'Đã hủy',
        'Ngưng hoạt động'
    ];

    const sanPhamOptions = ['ICC.SpeakWell', 'ICC.EasyPASS', 'ICC.EasyIELTS'];

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}?limit=${PAGE_SIZE}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'xc-token': API_TOKEN },
            });

            if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');

            const data = await response.json();
            groupDataByClassCode(data.list || []);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    // Hàm reset tất cả input và combobox
    const handleReset = () => {
        setSearchTerm('');
        setStatusFilter('');
        setProductFilter('');
        setStartDate('');
        setEndDate('');
        setPage(0);
        fetchData(0, '', '', '', ''); // Load lại dữ liệu
    };
    // Nhóm dữ liệu theo classCode
    const groupDataByClassCode = (data) => {
        const grouped = data.reduce((acc, row) => {
            if (!acc[row.classCode]) {
                acc[row.classCode] = { ...row, lichHoc: [] };
            }
            acc[row.classCode].lichHoc.push(`${row.ngayHoc}: ${row.gioBatDau} - ${row.gioKetThuc}`);
            return acc;
        }, {});

        setRows(Object.values(grouped));
    };

    return (
        <SnackbarProvider maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MainCard>
                <Typography variant="h5" sx={{ marginBottom: 2 }} fontWeight="bold">
                    Data Lớp
                </Typography>

                {/* Phần ô tìm kiếm và chọn trạng thái */}
                <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                    {/* Phần lọc dữ liệu */}
                    <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
                        <TextField
                            label="Tìm kiếm theo Mã lớp"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Ô nhập khoảng ngày */}
                        <TextField
                            label="Từ ngày"
                            type="date"
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={startDate ?? ""}
                            onChange={(e) => setStartDate(e.target.value)}
                            sx={{ width: 170 }}
                        />
                        <TextField
                            label="Đến ngày"
                            type="date"
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            sx={{ width: 170 }}
                        />
                        <FormControl size="small" variant="outlined" sx={{ width: 150 }}>
                            <InputLabel>Trạng thái lớp</InputLabel>
                            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Trạng thái">
                                <MenuItem value="">Tất cả</MenuItem>
                                {statusOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" variant="outlined" sx={{ width: 150 }}>
                            <InputLabel>Sản phẩm</InputLabel>
                            <Select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} label="Sản phẩm">
                                <MenuItem value="">Tất cả</MenuItem>
                                {sanPhamOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" variant="outlined" sx={{ width: 200 }}>
                            <InputLabel>Trình độ</InputLabel>
                            <Select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} label="Sản phẩm">
                                <MenuItem value="">Tất cả</MenuItem>
                                {sanPhamOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Nút Reset và Assign Task */}
                    <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                        <IconButton title="Reset bộ lọc" onClick={handleReset} sx={{ color: 'blue' }}>
                            <IconRefresh />
                        </IconButton>
                        <IconButton
                            color="primary"
                            title="Tạo lớp"
                            onClick={() => {
                                setOpenModal(true);
                            }}
                        >
                            <IconList />
                        </IconButton>
                    </Box>
                </Paper>
                {/* Modal hiển thị khi nhấn Assign Task */}
                {/* <CheckboxWithModal
          isVisible={openModal}
          onClose={() => setOpenModal(false)}
          selectedIds={Object.keys(checkedItems).filter((id) => checkedItems[id])} // Truyền danh sách ID đã chọn
        /> */}
                <AddModal open={openModal} onClose={() => setOpenModal(false)} />

                {/* Phần bảng dữ liệu */}
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <TableContainer sx={{ maxHeight: 500, overflow: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            onChange={(event) => {
                                                const isChecked = event.target.checked;
                                                const newCheckedItems = {};
                                                rows.forEach((row) => { newCheckedItems[row.Id] = isChecked; });
                                                setCheckedItems(newCheckedItems);
                                            }}
                                            checked={rows.length > 0 && rows.every((row) => checkedItems[row.Id])}
                                            indeterminate={rows.some((row) => checkedItems[row.Id]) && !rows.every((row) => checkedItems[row.Id])}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ width: '10px' }}>STT</TableCell>
                                    <TableCell sx={{ width: '100px' }}>Mã lớp</TableCell>
                                    <TableCell sx={{ width: '100px' }}>Sản phẩm</TableCell>
                                    <TableCell>Size</TableCell>
                                    <TableCell>Trình độ</TableCell>
                                    <TableCell sx={{ width: '100px' }}>Loại giáo viên</TableCell>
                                    <TableCell>Số buổi</TableCell>
                                    <TableCell sx={{ width: '150px' }}>Dự kiến khai giảng</TableCell>
                                    <TableCell sx={{ width: '200px' }}>Lịch học</TableCell>
                                    <TableCell>Tên giáo viên</TableCell>
                                    <TableCell>Slot còn</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={row.classCode}>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={!!checkedItems[row.Id]} onChange={() => setCheckedItems((prev) => ({ ...prev, [row.Id]: !prev[row.Id] }))} />
                                        </TableCell>
                                        <TableCell>{page * PAGE_SIZE + index + 1}</TableCell>
                                        <TableCell>{row.classCode}</TableCell>
                                        <TableCell>{row.product}</TableCell>
                                        <TableCell>{row.size}</TableCell>
                                        <TableCell>{row.trinhDo}</TableCell>
                                        <TableCell>{row.teacherType}</TableCell>
                                        <TableCell>{row.soBuoi}</TableCell>
                                        <TableCell>{row.ngayKhaiGiangDuKien}</TableCell>
                                        <TableCell>
                                            {row.lichHoc.map((item, i) => (
                                                <Typography key={i} variant="body2">
                                                    {item}
                                                </Typography>
                                            ))}
                                        </TableCell>
                                        <TableCell>{row.tenGiaoVien}</TableCell>
                                        <TableCell>{row.soSlotConLai}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>
                                            <IconButton title="Chỉnh sửa" onClick={() => navigate(`/data-ban-giao/edit/${row.Id}`)}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination component="div" count={totalRows} page={page} rowsPerPage={PAGE_SIZE} onPageChange={(event, newPage) => setPage(newPage)} />
                </Paper>
            </MainCard>
        </SnackbarProvider>
    );
}
