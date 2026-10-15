import localStore from '@/utils/localStore';
import { uploadFile } from '@/api/system/upload';
import Config from '@/config/index';
import { getUrl } from '@/utils/utils';

export type InsertFnType = (url: string, alt: string, href: string) => void;

export const MENU_CONF = {
  ['uploadImage']: {
    server: Config.baseUrl + 'BasePrivate/uploadFile',
    fieldName: 'file',
    maxFileSize: 1 * 1024 * 1024,
    maxNumberOfFiles: 10,
    headers: {
      'X-TOKEN': localStore.get('token'),
    },
    withCredentials: true,
    async customUpload(file: File, insertFn: InsertFnType) {
      try {
        const message = window.$message;
        const formData = new FormData();
        formData.append('file', file, file.name);
        const response: any = await uploadFile(formData, {
          headers: { 'X-TOKEN': localStore.get('token') },
        });
        if (response.code === 0) {
          insertFn(getUrl(response.data.file_name) || '', '', '');
        } else {
          message.error(response.msg || '上传失败');
        }
      } catch (error) {
        console.error('Error posting data:', error);
        window.$message.error('图片上传失败');
      }
    },
  },
};

export const ToolbarConfig = { excludeKeys: ['group-video'] };
