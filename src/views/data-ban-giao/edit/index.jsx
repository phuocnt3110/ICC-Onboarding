import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField, Button, CircularProgress, Box, Grid, MenuItem, Paper, Typography,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Dialog, DialogActions, DialogContent, DialogTitle, Tabs, Tab
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import Swal from 'sweetalert2';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';

const API_BASE_URL = 'https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records';
const API_TOKEN = '45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c';

export default function EditDataBanGiao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ctvOptions, setCtvOptions] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  // const [openModal, setOpenModal] = useState(false);
  const [noteTextOut, setNoteTextOut] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [initialData, setInitialData] = useState({});
  const [soKhoaDaMua, setSoKhoaDaMua] = useState(0);
  const [danhSachGoiMua, setDanhSachGoiMua] = useState([]);
  const [danhSachSanPham, setDanhSachSanPham] = useState([]);
  const [formData, setFormData] = useState({
    Id: '',
    tenHocVien: '',
    emailHocVien: '',
    soDienThoaiHocVien: '',
    tenNguoiDaiDien: '',
    sdtNguoiDaiDien: '',
    mailNguoiDaiDien: '',
    trangThaiChamSoc: '',
    trangThaiChonLop: '',
    trangThaiHocVien: '',
    trangThaiGoi: '',
    nguoiChamSoc: '',
    maLop: '',
    lichHoc: '',
    ngayKhaiGiangDuKien: '',
    diaChi: '',
  });

  const fetchHistoryData = async (url) => {

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "xc-token": API_TOKEN
        }
      });
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu lịch sử chăm sóc");

      const result = await response.json();
      setHistoryData(result.list || []);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử chăm sóc:", error);
    }
  };

  useEffect(() => {
    fetchHistoryData(`https://noco-erp.com/api/v2/tables/mmjdkkvi5kz810t/records?where=(idGoiMuaHocVien,eq,${id})`); // Load dữ liệu lịch sử chăm sóc
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    if (newIndex === 0) {
      fetchHistoryData(`https://noco-erp.com/api/v2/tables/mmjdkkvi5kz810t/records?where=(idGoiMuaHocVien,eq,${id})`);
    };
    if (newIndex === 1) {
      fetchHistoryData(`https://noco-erp.com/api/v2/tables/mmjdkkvi5kz810t/records?where=(maHocVien,eq,${data.maTheoDoi})`);
    };
  }
  // Khi dữ liệu được tải về, cập nhật state
  useEffect(() => {
    if (data && data.Id) {
      setFormData({
        Id: data.Id,
        tenHocVien: data.tenHocVien || '',
        emailHocVien: data.emailHocVien || '',
        soDienThoaiHocVien: data.soDienThoaiHocVien || '',
        tenNguoiDaiDien: data.tenNguoiDaiDien || '',
        sdtNguoiDaiDien: data.sdtNguoiDaiDien || '',
        mailNguoiDaiDien: data.mailNguoiDaiDien || '',
        trangThaiChamSoc: data.trangThaiChamSoc || '',
        trangThaiHocVien: data.trangThaiHocVien || '',
        trangThaiGoi: data.trangThaiGoi || '',
        nguoiChamSoc: data.nguoiChamSoc || '',
        maLop: data.maLop || '',
        lichHoc: data.lichHoc || '',
        ngayKhaiGiangDuKien: data.ngayKhaiGiangDuKien || '',
        trangThaiChonLop: data.trangThaiChonLop || '',
        diaChi: data.diaChi || '',
      });

      // Lưu dữ liệu ban đầu để so sánh
      setInitialData({
        Id: data.Id,
        tenHocVien: data.tenHocVien || '',
        emailHocVien: data.emailHocVien || '',
        soDienThoaiHocVien: data.soDienThoaiHocVien || '',
        tenNguoiDaiDien: data.tenNguoiDaiDien || '',
        sdtNguoiDaiDien: data.sdtNguoiDaiDien || '',
        mailNguoiDaiDien: data.mailNguoiDaiDien || '',
        trangThaiChamSoc: data.trangThaiChamSoc || '',
        trangThaiHocVien: data.trangThaiHocVien || '',
        trangThaiGoi: data.trangThaiGoi || '',
        nguoiChamSoc: data.nguoiChamSoc || '',
        maLop: data.maLop || '',
        lichHoc: data.lichHoc || '',
        ngayKhaiGiangDuKien: data.ngayKhaiGiangDuKien || '',
        trangThaiChonLop: data.trangThaiChonLop || '',
        diaChi: data.diaChi || '',
      });
    }
  }, [data]);

  // Hàm cập nhật giá trị khi nhập dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //Hàm thay đổi dữ liệu  KLy
  const handleSaveChanges = async () => {
    let changes = [];

    // Kiểm tra các trường nào đã thay đổi
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialData[key]) {
        changes.push(`${key}: ${initialData[key]} -> ${formData[key]}`);
      }
    });

    console.log(changes);

    if (changes.length === 0 && noteTextOut === "") {
      enqueueSnackbar("Chưa thay đổi thông tin nào", { variant: "info" });
      return;
    }

    // Tách changeMessage thành hai phần: thông tin học viên và thông tin khác
    const studentFields = [
      "tenHocVien",
      "emailHocVien",
      "soDienThoaiHocVien",
      "tenNguoiDaiDien",
      "sdtNguoiDaiDien",
      "mailNguoiDaiDien",
      "diaChi",
    ];

    const changeMessageStudent = changes
      .filter((change) => studentFields.some((field) => change.startsWith(field)))
      .join(",");

    const changeMessageOther = changes
      .filter((change) => !studentFields.some((field) => change.startsWith(field)))
      .join(",");

    Swal.fire({
      title: "Xác nhận cập nhật?",
      text: `Bạn có chắc chắn muốn lưu thay đổi này?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, cập nhật!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const isStudentInfoChanged = studentFields.some((field) =>
            changes.some((change) => change.startsWith(field))
          );

          const isOtherInfoChanged = changes.some((change) =>
            !studentFields.some((field) => change.startsWith(field))
          );

          if (!isStudentInfoChanged && isOtherInfoChanged) {
            const patchData = {
              Id: formData.Id,
              ...formData,
            };

            const patchResponse = await fetch(`${API_BASE_URL}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "xc-token": API_TOKEN,
              },
              body: JSON.stringify(patchData),
            });

            if (!patchResponse.ok) throw new Error("Lỗi khi cập nhật dữ liệu");

            if (changeMessageOther) {
              const submitNoteResult = await handleSubmitNote(changeMessageOther, formData.Id);
              if (!submitNoteResult) throw new Error("Lỗi khi lưu ghi chú");
            }
          }

          if (isStudentInfoChanged) {
            const response = await fetch(`${API_BASE_URL}?where=(maTheoDoi,eq,${data.maTheoDoi})`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "xc-token": API_TOKEN,
              },
            });

            if (!response.ok) throw new Error("Lỗi khi tìm kiếm dữ liệu");

            const result = await response.json();
            const records = result.list || [];

            for (const record of records) {
              const patchData = {
                Id: record.Id,
                tenHocVien: formData.tenHocVien,
                emailHocVien: formData.emailHocVien,
                soDienThoaiHocVien: formData.soDienThoaiHocVien,
                tenNguoiDaiDien: formData.tenNguoiDaiDien,
                sdtNguoiDaiDien: formData.sdtNguoiDaiDien,
                mailNguoiDaiDien: formData.mailNguoiDaiDien,
                diaChi: formData.diaChi,
              };

              // Cập nhật dữ liệu
              const patchResponse = await fetch(`${API_BASE_URL}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "xc-token": API_TOKEN,
                },
                body: JSON.stringify(patchData),
              });

              if (!patchResponse.ok) throw new Error("Lỗi khi cập nhật dữ liệu");

              if (record.Id === formData.Id) {
                const combinedChangeMessage = changeMessageStudent
                  ? `${changeMessageStudent},${changeMessageOther}`
                  : changeMessageOther;

                if (combinedChangeMessage) {
                  const submitNoteResult = await handleSubmitNote(combinedChangeMessage, record.Id);
                  // if (!submitNoteResult) throw new Error("Lỗi khi lưu ghi chú");
                }
              } else {
                if (changeMessageStudent) {
                  const submitNoteResult = await handleSubmitNote(changeMessageStudent, record.Id);
                  // if (!submitNoteResult) throw new Error("Lỗi khi lưu ghi chú");
                }
              }
            }
          }

          setInitialData(formData);

          enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
          setNoteTextOut("");
        } catch (error) {
          enqueueSnackbar("Lỗi khi cập nhật!", { variant: "error" });
        }
      }
    });
  };
  //
  useEffect(() => {
    const fetchCtv = async () => {
      try {
        const response = await fetch("https://noco-erp.com/api/v2/tables/md4f2720q4qrdqr/records", {
          method: "GET",
          headers: { "Content-Type": "application/json", "xc-token": API_TOKEN },
        });
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu");
        const data = await response.json();
        setCtvOptions(data.list || []); // Lưu danh sách vào state
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    fetchCtv();
  }, []);
  // Post Note khi ấn nút Thêm Ghi Chú
  const handleSubmitNote = async (changeMessage, idTruyenVao) => {
    let combinedNote = '';

    if (changeMessage && noteTextOut) {
      combinedNote = `Thay đổi: ${changeMessage} \nGhi chú: ${noteTextOut}`;
    } else if (changeMessage) {
      combinedNote = `Thay đổi: ${changeMessage}`;
    } else if (noteTextOut) {
      combinedNote = `Ghi chú: ${noteTextOut}`;
    }

    const requestData = {
      idGoiMuaHocVien: idTruyenVao != "" ? idTruyenVao : id,
      trangThaiChamSoc: formData.trangThaiChamSoc,
      note: combinedNote,
      nguoiChamSoc: formData.nguoiChamSoc,
      maHocVien: data.maTheoDoi,
      sanPham: data.sanPham,
      trinhDo: data.goiMua,
      createBy: formData.nguoiChamSoc,
    };

    try {
      const response = await fetch('https://noco-erp.com/api/v2/tables/mmjdkkvi5kz810t/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xc-token': API_TOKEN
        },
        body: JSON.stringify(requestData)
      });
      if (response.ok) {
        // console.log(JSON.stringify(requestData));
        fetchHistoryData(`https://noco-erp.com/api/v2/tables/mmjdkkvi5kz810t/records?where=(idGoiMuaHocVien,eq,${id})`);
        return true;
      } else {
        // Swal.fire('Lỗi!', 'Không thể thêm note', 'error');
        return false;
      }
    } catch (error) {
      // console.error('Lỗi khi gửi yêu cầu:', error);
      // Swal.fire('Lỗi!', 'Không thể thêm note', 'error');
      return false;
    }
  };


  //Tìm data học viên tương ứng
  // Hàm fetchData riêng biệt
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?where=(Id,eq,${id})`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "xc-token": API_TOKEN,
        },
      });

      const result = await response.json();
      if (result.list.length > 0) {
        setData(result.list[0]);
      } else {
        setError("Không tìm thấy dữ liệu");
      }
    } catch (err) {
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchData trong useEffect để load dữ liệu khi component mount hoặc id thay đổi
  useEffect(() => {
    fetchData();
  }, [id]);


  const trangThaiOptions = [
    'L0.Đơn cọc',
    'L1.1.Không nghe máy/ thuê bao',
    'L1.2.Trùng data',
    'L2.Nghe máy và không xác nhận lịch',
    'L3.Nghe máy và xác nhận lịch',
    'L4.Hủy bàn giao'
  ];

  const trangThaiGoiOptions = [
    'Active',
    'Paid_in_advance',
    'Out_of_Date'
  ];

  const trangThaiHocVienOptions = [
    'Progress',
    'Pending',
    'Not_started',
    'Expired',
    'Dropout'
  ];
  useEffect(() => {
    const fetchSoKhoaDaMua = async () => {
      try {
        const response = await fetch(`https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records/count?where=(maTheoDoi,eq,${data.maTheoDoi})~and(sanPham,eq,${data.sanPham})`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "xc-token": API_TOKEN,
          },
        });
        const result = await response.json();
        setSoKhoaDaMua(result.count);
      } catch (error) {
        console.error("Lỗi khi lấy số khóa đã mua:", error);
      }
    };

    const fetchDanhSachGoiMua = async () => {
      try {
        const response = await fetch(`https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records?where=(maTheoDoi,eq,${data.maTheoDoi})~and(sanPham,eq,${data.sanPham})`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "xc-token": API_TOKEN,
          },
        });
        const result = await response.json();
        setDanhSachGoiMua(result.list || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách gói mua:", error);
      }
    };

    if (data && data.maTheoDoi && data.sanPham) {
      fetchSoKhoaDaMua();
      fetchDanhSachGoiMua();
    }
  }, [data]);
  useEffect(() => {
    const fetchDanhSachSanPham = async () => {
      try {
        const response = await fetch(
          `https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records?where=(maTheoDoi,eq,${data.maTheoDoi})`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "xc-token": API_TOKEN,
            },
          }
        );
        const result = await response.json();
        setDanhSachSanPham(result.list || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    if (data && data.maTheoDoi) {
      fetchDanhSachSanPham();
    }
  }, [data]);

  const nhomSanPhamTheoGoiMua = (danhSachSanPham) => {
    return danhSachSanPham.reduce((acc, item) => {
      const sanPham = item.sanPham;
      if (!acc[sanPham]) {
        acc[sanPham] = [];
      }
      acc[sanPham].push(item);
      return acc;
    }, {});
  };

  const danhSachNhom = nhomSanPhamTheoGoiMua(danhSachSanPham);

  if (loading) return <CircularProgress />;
  if (error) return <p>{error}</p>;

  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right', autoHideDuration: 2000 }}>
      <MainCard title="Chỉnh Sửa Data">
        <Box component="form" sx={{ flexGrow: 1 }} onSubmit={(e) => e.preventDefault()}>
          <Paper elevation={3} sx={{ padding: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Thông tin gói mua</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField name="ngayBanGiao" label="Ngày Bàn Giao" value={data.ngayBanGiao || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="nguoiBanGiao" label="Người Bàn Giao" value={data.nguoiBanGiao || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="maDaiSu" label="Mã Đại Sứ" value={data.maDaiSu || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="billItemId" label="Bill Item ID" value={data.billItemId || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="billItemBillId" label="Bill Item Bill ID" value={data.billItemBillId || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="loaiDon" label="Loại Đơn" value={data.loaiDon || ''} fullWidth sx={{ mb: 2 }} disabled />
                {/* <TextField name="loaiDon" label="Trạng thái gói" value={data.trangThaiGoi || ''} fullWidth sx={{ mb: 2 }} /> */}
                <TextField
                  name="trangThaiGoi"
                  label="Trạng Thái Gói"
                  select
                  value={formData.trangThaiGoi}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {trangThaiGoiOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField name="loaiLop" label="Loại Lớp" value={data.loaiLop || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="sanPham" label="Sản Phẩm" value={data.sanPham || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="goiMua" label="Gói Mua" value={data.goiMua || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="soBuoi" label="Số Buổi" value={data.soBuoi || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="loaiGv" label="Loại Giáo Viên" value={data.loaiGv || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="sizeLop" label="Size Lớp" value={data.sizeLop || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField
                  name="soKhoaDaMua"
                  label={`Số khóa đã mua: ${soKhoaDaMua}`}
                  value=""
                  fullWidth
                  multiline
                  rows={6}
                  sx={{
                    height: 'auto',
                    mb: 2,
                    '& .MuiInputBase-root': {
                      height: '100%',
                    },
                  }}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                    inputComponent: 'div',
                    inputProps: {
                      children: (
                        <Box>
                          {danhSachGoiMua.map((goi, index) => (
                            <Typography
                              key={index}
                              component="span"
                              sx={{
                                fontWeight: goi.trangThaiGoi === 'Active' ? 'bold' : 'normal',
                                color: goi.trangThaiGoi === 'Active' ? 'green' : 'inherit',
                                marginRight: 1,
                              }}
                            >
                              {goi.goiMua}
                              {index < danhSachGoiMua.length - 1 ? ', ' : ''}
                            </Typography>
                          ))}
                        </Box>
                      ),
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Thông tin học viên
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField name="maTheoDoi" label="Mã Theo Dõi" value={data.maTheoDoi || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="maHocVienGiaHan" label="Mã Học Viên Gia Hạn" value={data.maHocVienGiaHan || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField
                  name="tenHocVien"
                  label="Tên Học Viên"
                  value={formData.tenHocVien}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="emailHocVien"
                  label="Email Học Viên"
                  value={formData.emailHocVien}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="diaChi"
                  label="Địa chỉ"
                  value={formData.diaChi}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="soDienThoaiHocVien"
                  label="SĐT Học Viên"
                  value={formData.soDienThoaiHocVien}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="tenNguoiDaiDien"
                  label="Tên Người Đại Diện"
                  value={formData.tenNguoiDaiDien}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="sdtNguoiDaiDien"
                  label="SĐT Người Đại Diện"
                  value={formData.sdtNguoiDaiDien}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="mailNguoiDaiDien"
                  label="Email Người Đại Diện"
                  value={formData.mailNguoiDaiDien}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="trangThaiHocVien"
                  label="Trạng Thái Học Viên"
                  select
                  value={formData.trangThaiHocVien}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {trangThaiHocVienOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Thông tin lớp học
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField name="maLop" label="Mã Lớp" value={data.maLop || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="lichHoc" label="Lịch học" value={data.lichHoc || ''} fullWidth sx={{ mb: 2 }} disabled />
                <TextField name="ngayKhaiGiangDuKien" label="Ngày khai giảng dự kiến" value={data.ngayKhaiGiangDuKien || ''} fullWidth sx={{ mb: 2 }} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField name="maLop" label="Trạng thái Lớp" value={data.maLop || ''} fullWidth sx={{ mb: 2 }} disabled />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Thông tin chăm sóc</Typography>
            <TextField
              name="trangThaiChamSoc"
              label="Trạng Thái Chăm Sóc"
              select
              value={formData.trangThaiChamSoc}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              {trangThaiOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              name="nguoiChamSoc"
              label="Người Chăm Sóc"
              value={formData.nguoiChamSoc}
              fullWidth
              sx={{ mb: 2 }}
              onChange={handleChange}          >
              {ctvOptions.map((ctv) => (
                <MenuItem key={ctv.Id} value={ctv.hoTen}>
                  {ctv.hoTen}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="note"
              label="Ghi chú"
              fullWidth
              multiline
              rows={3}
              value={noteTextOut}
              onChange={(e) => setNoteTextOut(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Paper>
          <Paper elevation={3} sx={{ padding: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Thông tin sản phẩm và gói mua
            </Typography>

            {/* Tabs để hiển thị các sản phẩm */}
            <Tabs
              value={selectedTabIndex}
              onChange={(event, newValue) => setSelectedTabIndex(newValue)}
              aria-label="Danh sách sản phẩm"
            >
              {Object.entries(danhSachNhom).map(([sanPham], index) => (
                <Tab key={sanPham} label={sanPham} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
              ))}
            </Tabs>
            {Object.entries(danhSachNhom).map(([sanPham, danhSachGoiMua], index) => (
              <Box
                key={sanPham}
                role="tabpanel"
                hidden={selectedTabIndex !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
              >
                {selectedTabIndex === index && (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên gói mua</TableCell>
                          <TableCell>Trạng thái gói mua</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {danhSachGoiMua.map((goi) => (
                          <TableRow key={goi.goiMua}>
                            <TableCell>{goi.goiMua}</TableCell>
                            <TableCell>
                              <Typography
                                sx={{
                                  fontWeight: goi.trangThaiGoi === 'Active' ? 'bold' : 'normal',
                                  color: goi.trangThaiGoi === 'Active' ? 'green' : 'inherit',
                                }}
                              >
                                {goi.trangThaiGoi}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            ))}
          </Paper>

          <Paper elevation={3} sx={{ padding: 2, mb: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Lịch sử">
              <Tab label="Lịch sử gói" />
              <Tab label="Lịch sử chăm sóc học viên" />
            </Tabs>

            {tabIndex === 0 && (
              <TableContainer component={Paper} sx={{ maxHeight: '400px', overflow: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Người thay đổi</TableCell>
                      <TableCell>Người chăm sóc</TableCell>
                      <TableCell>Mã HV</TableCell>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>Trình độ</TableCell>
                      <TableCell>Trạng thái chăm sóc</TableCell>
                      <TableCell>Ghi chú</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyData.length > 0 ? (
                      historyData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.thoiGian || ""}</TableCell>
                          <TableCell>{row.createBy || ""}</TableCell>
                          <TableCell>{row.nguoiChamSoc || ""}</TableCell>
                          <TableCell>{row.maHocVien || ""}</TableCell>
                          <TableCell>{row.sanPham || ""}</TableCell>
                          <TableCell>{row.trinhDo || ""}</TableCell>
                          <TableCell>{row.trangThaiChamSoc || ""}</TableCell>
                          <TableCell>{row.note || ""}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center"></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tabIndex === 1 && (
              <TableContainer component={Paper} sx={{ maxHeight: '400px', overflow: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Người thay đổi</TableCell>
                      <TableCell>Người chăm sóc</TableCell>
                      <TableCell>Mã HV</TableCell>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>Trình độ</TableCell>
                      <TableCell>Trạng thái chăm sóc</TableCell>
                      <TableCell>Ghi chú</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyData.length > 0 ? (
                      historyData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.thoiGian || ""}</TableCell>
                          <TableCell>{row.createBy || ""}</TableCell>
                          <TableCell>{row.nguoiChamSoc || ""}</TableCell>
                          <TableCell>{row.maHocVien || ""}</TableCell>
                          <TableCell>{row.sanPham || ""}</TableCell>
                          <TableCell>{row.trinhDo || ""}</TableCell>
                          <TableCell>{row.trangThaiChamSoc || ""}</TableCell>
                          <TableCell>{row.note || ""}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center"></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
          <Box mt={2} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Lưu thay đổi
            </Button>
            <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => navigate('/data-ban-giao')}>Quay Lại</Button>
          </Box>
        </Box>
      </MainCard>
    </SnackbarProvider>
  );
}