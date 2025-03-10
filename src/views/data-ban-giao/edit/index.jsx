import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Box, Grid, MenuItem } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import Swal from 'sweetalert2';

const API_BASE_URL = 'https://noco-erp.com/api/v2/tables/mj4sos7rrkeysgp/records';
const API_TOKEN = '45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c';

export default function EditDataBanGiao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const trangThaiOptions = [
    'L0.Đơn cọc',
    'L1.1.Không nghe máy/ thuê bao',
    'L1.2.Trùng data',
    'L2.Nghe máy và không xác nhận lịch',
    'L3.Nghe máy và xác nhận lịch',
    'L4.Hủy bàn giao'
  ];



  ////

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}?where=(Id,eq,${id})`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': API_TOKEN
          }
        });
        const result = await response.json();
        if (result.list.length > 0) {
          setData(result.list[0]);
        } else {
          setError('Không tìm thấy dữ liệu');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


  const handleSave = async () => {
    const confirm = await Swal.fire({
      title: 'Xác nhận lưu?',
      text: 'Bạn có chắc chắn muốn lưu thay đổi?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy'
    });

    if (!confirm.isConfirmed) return;

    // Đảm bảo các trường không null
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value ?? null])
    );

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'xc-token': API_TOKEN
        },
        body: JSON.stringify(sanitizedData)
      });
      console.log(JSON.stringify(sanitizedData));

      if (response.ok) {
        Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật.', 'success');
      } else {
        console.log(response.body);

        // console.log(sanitizedData);
        Swal.fire('Lỗi!', 'Không thể cập nhật dữ liệu.', 'error');
      }
    } catch (error) {
      Swal.fire('Lỗi!', 'Có lỗi xảy ra khi gửi yêu cầu.', 'error');
    }
  };


  if (loading) return <CircularProgress />;
  if (error) return <p>{error}</p>;

  return (
    <MainCard title="Chỉnh Sửa Data">
      <Box component="form" sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* Ẩn cột ID */}
            <TextField
              name="ngayBanGiao"
              label="Ngày Bàn Giao"
              defaultValue={data.ngayBanGiao || ""}
              
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField name="nguoiBanGiao" label="Người Bàn Giao" value={data.nguoiBanGiao || ""}  fullWidth sx={{ mb: 2 }} />
            <TextField name="maDaiSu" label="Mã Đại Sứ" value={data.maDaiSu || ""}  fullWidth sx={{ mb: 2 }} />
            <TextField name="billItemId" label="Bill Item ID" value={data.billItemId || ""}  fullWidth sx={{ mb: 2 }} />
            <TextField name="tenHocVien" label="Tên Học Viên" value={data.tenHocVien || ""}  fullWidth sx={{ mb: 2 }} />
            <TextField name="emailHocVien" label="Email Học Viên" value={data.emailHocVien || ""}  fullWidth sx={{ mb: 2 }} />
            <TextField name="sdtHocVien" label="SĐT Học Viên" value={data.sdtHocVien || ""}  fullWidth sx={{ mb: 2 }} />
            <TextField name="tenNguoiDaiDien" label="Tên Người Đại Diện" value={data.tenNguoiDaiDien || ""}  fullWidth sx={{ mb: 2 }} />
            <TextField name="sdtNguoiDaiDien" label="SĐT Người Đại Diện" value={data.sdtNguoiDaiDien || ""}  fullWidth sx={{ mb: 2 }} />

            <TextField
              select
              label="Trạng Thái Chăm Sóc"
              value={data.trangThaiChamSoc || ''} // Đảm bảo không bị lỗi khi data null
              onChange={(e) => setData({ ...data, trangThaiChamSoc: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            >
              {trangThaiOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

          </Grid>
          <Grid item xs={6}>
            <TextField label="Email Người Đại Diện" value={data.emailNguoiDaiDien ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Gói Mua" value={data.goiMua ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Số Buổi" value={data.soBuoi ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Loại Giáo Viên" value={data.loaiGiaoVien ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Size Lớp" value={data.sizeLop ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Mã Học Viên Gia Hạn" value={data.maHocVienGiaHan ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Sản Phẩm" value={data.sanPham ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Loại Đơn" value={data.loaiDon ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Loại Lớp" value={data.loaiLop ?? ""} fullWidth sx={{ mb: 2 }} />
            <TextField label="Mã Theo Dõi Mới" value={data.maTheoDoiMoi ?? ""} fullWidth sx={{ mb: 2 }} />

          </Grid>
        </Grid>
        <Box mt={2} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleSave}>Lưu Thay Đổi</Button>
          <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => navigate('/data-ban-giao')}>
            Quay Lại
          </Button>
        </Box>
      </Box>
    </MainCard>
  );
}
