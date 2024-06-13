import React, { ReactElement, useEffect, useMemo, useState } from "react";
import MainAdmin from "../../components/Layouts/MainAdmin";
import { getPurchaseAll } from "../../services/product";
import LoadingPage from "../../components/Loading/LoadingPage";
import ContentHeader from "../../components/Header/ContentHeader";
import Card from "../../components/Card";
import Table from "../../components/Table";
import { Pagination } from "swiper";
import ModalImg from "../../components/Modal/ModalImg";
import { useRouter } from "next/router";
import { PurchaseProps } from "../../interfaces/product";
import dateFormat from "dateformat";
import {
  getOrderStatusInVietnamese,
  getStatusColor,
} from "../../utils/statusOrder";
import DropDown from "../../components/DropDown";

const columnPurchase = [
  "Số thứ tự",
  "Tên sản phẩm",
  "Size",
  "Màu sắc",
  "Ảnh",
  "Giá",
  "Số lượng",
  "Ngày bán",
  "Trạng thái",
];

const listStatus = [
  { title: "Đang chờ", value: "pending" },
  { title: "Đang xử lý", value: "processing" },
  { title: "Đang giao hàng", value: "shipped" },
  { title: "Đã giao thành công", value: "delivered" },
  { title: "Đã hủy", value: "cancelled" },
];
const DEFAULT_PRODUCTS_LIMIT = 5;

const Purchase = ({ loading }: { loading: Boolean }) => {
  const [dataPurchase, setDataPurchase] = useState<PurchaseProps[]>([]);
  const [selectValue, setSelectValue] = useState();

  const router = useRouter();

  let count = DEFAULT_PRODUCTS_LIMIT * (Number(router.query.page ?? 1) - 1) + 1;
  const fetchAllPurchase = async () => {
    try {
      const res = await getPurchaseAll();
      console.log("res", res);
      setDataPurchase(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllPurchase();
  }, []);
  const handleItemSelected = (selectedItem: any) => {
    console.log(`Selected item: ${selectedItem.name}`);
  };

  const dataSourcePurchase = useMemo(() => {
    return dataPurchase.map((item, index) => {
      return [
        <> {count === 0 ? index + 1 : count++}</>,
        <div>{item.nameProd}</div>,
        <div>{item.sizeProd}</div>,
        <div>{item.colorProd}</div>,
        <img
          className="w-1/2 cursor-pointer rounded-lg object-cover"
          src={item.imageProd}
        />,
        <p>{item?.priceProd.toLocaleString("vi")} đ</p>,
        <p>{item.quantityProd}</p>,
        <>{dateFormat(item?.updatedAt, "HH:MM dd/mm/yyyy")}</>,
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold `}
        >
          <DropDown
            listData={listStatus}
            selectValue={selectValue}
            setSelectValue={setSelectValue}
            defaultValue={item.status}
          />
        </span>,
      ];
    });
  }, [dataPurchase]);

  return (
    <>
      {loading && <LoadingPage />}
      <ContentHeader
        title="Quản lý sản phẩm đã bán"
        name="Danh sách sản phẩm đã bán"
      />
      <Card>
        <Card.Content>
          <Table columns={columnPurchase} dataSource={dataSourcePurchase} />
        </Card.Content>
        {/* <Pagination
          current={Number(router.query.page || 1)}
          pageSize={limitValue}
          total={totalProduct}
          onChange={onChangePage}
          setLimitValue={setLimitValue}
        /> */}
      </Card>
    </>
  );
};

Purchase.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Purchase;
