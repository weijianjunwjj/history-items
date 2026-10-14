import { get, post } from '@/http/request';

export const getList = (params: any) => get('/AppUser/index', params);
export const banUser = (params: any) => post('/AppUser/ban', params);
export const openUser = (params: any) => post('/AppUser/unban', params);
export const delUser = (params: any) => post('/AppUser/del', params);
export const editUser = (params: any) => post('/AppUser/edit', params);
export const detailUser = (params: any) => get('/AppUser/detail', params);
export const getPosts = (params: {
  page: number;
  pageSize: number;
  userId: number;
}) => get('/Post/index', params);
export const getIntegralRecordIndex = (params:any) =>
  get('/IntegralRecord/index', params);
