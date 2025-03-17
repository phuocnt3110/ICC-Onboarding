import React, { useState, useEffect } from "react";
import { Modal, Table, Input, Button } from "antd";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import Swal from 'sweetalert2';
//Api ctv
const API_BASE_URL = "https://noco-erp.com/api/v2/tables/md4f2720q4qrdqr/records";
const API_TOKEN = "45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c";

const CheckboxWithModal = ({ isVisible, onClose, selectedIds }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (isVisible) fetchData();
  }, [isVisible, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}?limit=${pageSize}&shuffle=0&offset=${(page - 1) * pageSize}`;

      if (search.trim()) {
        url += `&where=(hoTen,eq,${encodeURIComponent(search)})`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "xc-token": API_TOKEN
        }
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result.list);
      setTotal(result.pageInfo.totalRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleAssign = async (record) => {

    const confirmResult = await Swal.fire({
      title: "Xác nhận",
      text: `Bạn có chắc chắn muốn gán ${record.hoTen} cho các học viên đã chọn không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const requests = selectedIds.map((Id) =>
        fetch("https://noco-erp.com/api/v2/tables/mk6ivvxeycpuwp4/records", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "xc-token": API_TOKEN,
          },
          body: JSON.stringify({ Id: Id, nguoiChamSoc: record.hoTen }),
        })
      );

      await Promise.all(requests); // Chạy tất cả yêu cầu PATCH song song

      enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
      onClose()
      setTimeout(() => {
        window.location.reload(); // Reload lại trang sau khi modal đóng
      }, 500);
    } catch (error) {
      // console.error("Lỗi khi cập nhật:", error);
      // enqueueSnackbar("Có lỗi xảy ra, vui lòng thử lại!", { variant: "error", autoHideDuration: 2000 });
    }
  };

  return (
    <Modal title="Danh sách cộng tác viên" open={isVisible} onCancel={onClose} footer={null}>
      <Input.Search
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSearch={() => {
          setPage(1);
          fetchData();
        }}
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={data.map((item, index) => ({
          ...item,
          stt: (page - 1) * pageSize + index + 1, // Tính STT theo trang
        }))}
        loading={loading}
        rowKey="Id"
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p) => setPage(p),
        }}
        columns={[
          { title: "STT", dataIndex: "stt", key: "stt", width: 70 }, // Thêm STT
          { title: "Tên", dataIndex: "hoTen", key: "hoTen" },
          { title: "SDT", dataIndex: "sdt", key: "sdt" },
          { title: "Chức vụ", dataIndex: "role", key: "role" },
          {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
              <Button type="primary" onClick={() => handleAssign(record)}>
                Assign
              </Button>
            ),
          },
        ]}
      />

    </Modal>
  );
};

export default CheckboxWithModal;
