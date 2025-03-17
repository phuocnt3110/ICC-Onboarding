import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Thông báo
  const [taiKhoan, setTaiKhoan] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const API_TOKEN = "45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c";

  // Xử lý hiện/ẩn mật khẩu
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Xử lý đăng nhập
  const handleLogin = async () => {
    if (!taiKhoan || !matKhau) {
      enqueueSnackbar('Vui lòng nhập đầy đủ thông tin!', { variant: 'warning' });
      return;
    }

    const apiUrl = `https://noco-erp.com/api/v2/tables/mpyiz3tcxk9jry7/records?(maNhanVien,eq,${taiKhoan})~and(matKhau,eq,${matKhau})`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "xc-token": API_TOKEN, // Thêm token vào headers
        },
      });

      const result = await response.json();

      if (response.ok && result.list && result.list.length > 0) {
        const userData = result.list[0]; // Lấy thông tin user đầu tiên trong danh sách trả về
        enqueueSnackbar('Đăng nhập thành công!', { variant: 'success' });

        // Lưu token vào localStorage
        localStorage.setItem("authToken", API_TOKEN);

        // Lưu thông tin user vào localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Chuyển hướng vào trang /data-ban-giao
        navigate('/data-ban-giao');
      }
      else {
        enqueueSnackbar('Sai tài khoản hoặc mật khẩu!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      enqueueSnackbar('Lỗi kết nối, vui lòng thử lại!', { variant: 'error' });
    }
  };

  return (
    <>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="taiKhoan">Tài khoản</InputLabel>
        <OutlinedInput
          id="taiKhoan"
          type="text"
          value={taiKhoan}
          onChange={(e) => setTaiKhoan(e.target.value)}
          placeholder="Nhập tài khoản"
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="matKhau">Mật khẩu</InputLabel>
        <OutlinedInput
          id="matKhau"
          type={showPassword ? 'text' : 'password'}
          value={matKhau}
          onChange={(e) => setMatKhau(e.target.value)}
          placeholder="Nhập mật khẩu"
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <Button color="secondary" fullWidth size="large" variant="contained" onClick={handleLogin}>
          Đăng nhập
        </Button>
      </Box>
    </>
  );
}
