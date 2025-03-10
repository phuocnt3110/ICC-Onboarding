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
import CheckboxWithModal from './modal-checkbox-ban-giao';

const API_BASE_URL = 'https://noco-erp.com/api/v2/tables/mj4sos7rrkeysgp/records';
const API_TOKEN = '45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c';
const PAGE_SIZE = 50;

export default function DataBanGiao() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [ctvFilter, setCtvFilter] = useState('');
  const [ctvOptions, setCtvOptions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();
  // State để điều khiển modal
  const [openModal, setOpenModal] = useState(false);

  const trangThaiOptions = [
    'L0.Đơn cọc',
    'L1.1.Không nghe máy/ thuê bao',
    'L1.2.Trùng data',
    'L2.Nghe máy và không xác nhận lịch',
    'L3.Nghe máy và xác nhận lịch',
    'L4.Hủy bàn giao'
  ];

  const sanPhamOptions = ['ICC.SpeakWell', 'ICC.EasyPASS', 'ICC.EasyIELTS'];

  // Fetch danh sách người chăm sóc (ctv) từ API
  const fetchCtv = async () => {
    try {
      const response = await fetch("https://noco-erp.com/api/v2/tables/md4f2720q4qrdqr/records", {
        method: "GET",
        headers: { "Content-Type": "application/json", "xc-token": API_TOKEN },
      });

      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu");

      const data = await response.json();
      setCtvOptions(data.list || []); // Lưu danh sách vào state riêng
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };


  useEffect(() => {
    fetchCtv();
  }, []);

  const fetchData = async (currentPage) => {
    const offset = currentPage * PAGE_SIZE;

    let conditions = [];

    // Điều kiện tìm kiếm (nối bằng ~or~ trong ())
    if (searchTerm) {
      let searchConditions = [];
      searchConditions.push(`(maTheoDoiMoi,eq,${encodeURIComponent(searchTerm)})`);
      searchConditions.push(`(nguoiBanGiao,eq,${encodeURIComponent(searchTerm)})`);
      searchConditions.push(`(tenHocVien,eq,${encodeURIComponent(searchTerm)})`);
      searchConditions.push(`(sdtHocVien,eq,${encodeURIComponent(searchTerm)})`);

      conditions.push(`(${searchConditions.join("~orD")})`);
    }

    // Điều kiện bộ lọc (nối bằng ~and~)
    if (statusFilter) {
      conditions.push(`(trangThaiChamSoc,eq,${encodeURIComponent(statusFilter)})`);
    }
    if (productFilter) {
      conditions.push(`(sanPham,eq,${encodeURIComponent(productFilter)})`);
    }
    if (ctvFilter) {
      conditions.push(`(nguoiChamSoc,eq,${encodeURIComponent(ctvFilter)})`);
    }

    // Xây dựng chuỗi truy vấn `where`
    let whereQuery = conditions.length > 0 ? `&where=(${conditions.join("~and")})` : '&where=';

    const url = `${API_BASE_URL}?limit=${PAGE_SIZE}&offset=${offset}${whereQuery}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'xc-token': API_TOKEN },
      });

      if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
console.log(url);

      const data = await response.json();
      setRows(data.list || []);
      setTotalRows(data.pageInfo.totalRows);
      setCheckedItems({});
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };



  useEffect(() => {
    fetchData(page);
  }, [page, searchTerm, statusFilter, productFilter, ctvFilter]);

  // Hàm reset tất cả input và combobox
  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setProductFilter('');
    setCtvFilter('');
    setStartDate('');
    setEndDate('');
    setPage(0);
    fetchData(0, '', '', '', ''); // Load lại dữ liệu
  };


  return (
    <SnackbarProvider maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MainCard>
        <Typography variant="h5" sx={{ marginBottom: 2 }} fontWeight="bold">
          Data Bàn Giao
        </Typography>

        {/* Phần ô tìm kiếm và chọn trạng thái */}
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, display: 'flex', alignItems: 'center' }}>
          {/* Phần lọc dữ liệu */}
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <TextField
              label="Tìm kiếm theo tên, SĐT, Mã theo dõi"
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
              <InputLabel>Trạng thái chăm sóc</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Trạng thái">
                <MenuItem value="">Tất cả</MenuItem>
                {trangThaiOptions.map((option, index) => (
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
              <InputLabel>Người chăm sóc</InputLabel>
              <Select
                value={ctvFilter}
                onChange={(e) => setCtvFilter(e.target.value)}
                label="Người chăm sóc"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {ctvOptions.map((item) => (
                  <MenuItem key={item.Id} value={item.hoTen}>
                    {item.hoTen}
                  </MenuItem>
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
              title="Assign Task"
              onClick={() => {
                const selectedIds = Object.keys(checkedItems).filter((id) => checkedItems[id]);

                if (selectedIds.length === 0) {
                  enqueueSnackbar('Vui lòng chọn ít nhất một bản ghi!', { variant: 'warning', autoHideDuration: 2000 });
                } else {
                  setOpenModal(true);
                }
              }}
            >
              <IconList />
            </IconButton>
          </Box>
        </Paper>
        {/* Modal hiển thị khi nhấn Assign Task */}
        <CheckboxWithModal
          isVisible={openModal}
          onClose={() => setOpenModal(false)}
          selectedIds={Object.keys(checkedItems).filter((id) => checkedItems[id])} // Truyền danh sách ID đã chọn
        />

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
                  <TableCell>STT</TableCell>
                  <TableCell>Ngày bàn giao</TableCell>
                  <TableCell>Mã theo dõi mới</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Gói mua</TableCell>
                  <TableCell>Tên học viên</TableCell>
                  <TableCell>SĐT học viên</TableCell>
                  <TableCell>Lộ trình</TableCell>
                  <TableCell>Trạng thái chăm sóc</TableCell>
                  <TableCell>Người chăm sóc</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.Id}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={!!checkedItems[row.Id]} onChange={() => setCheckedItems((prev) => ({ ...prev, [row.Id]: !prev[row.Id] }))} />
                    </TableCell>
                    <TableCell>{page * PAGE_SIZE + index + 1}</TableCell>
                    <TableCell>{row.ngayBanGiao}</TableCell>
                    <TableCell>{row.maTheoDoiMoi}</TableCell>
                    <TableCell>{row.sanPham}</TableCell>
                    <TableCell>{row.goiMua}</TableCell>
                    <TableCell>{row.tenHocVien}</TableCell>
                    <TableCell>{row.sdtHocVien}</TableCell>
                    <TableCell>{row.loTrinh}</TableCell>
                    <TableCell>{row.trangThaiChamSoc}</TableCell>
                    <TableCell>{row.nguoiChamSoc}</TableCell>
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
