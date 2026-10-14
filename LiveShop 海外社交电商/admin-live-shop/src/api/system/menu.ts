import { get, post, remove } from '@/http/request';

export const getList = (params: any) => get('Menu/index', params);

export const del = (id: any) => get('Menu/del', { id });

export const delBatch = (id: number[]) => remove('Menu/deleteByIds', { id });

export const edit = (data: any) => post('Menu/edit', data);

export const add = (data: any) => post('Menu/add', data);
