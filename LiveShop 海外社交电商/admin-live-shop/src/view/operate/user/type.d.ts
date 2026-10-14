export interface goodsDetailType {
  name: string;
  itemNumber: string;
  OP: string;
  purPrice: string;
  freight: string;
  specName: string;
  specVal: string;
  sale_num: string;
  stock: string;
  className: string;
  img: string;
}

export interface searchFormType {
  name: string;
  ItemNumber: string;
  classId: number | undefined;
  categoryId: number | undefined;
}