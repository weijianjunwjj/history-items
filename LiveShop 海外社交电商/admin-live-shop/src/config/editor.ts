import localStore from '@/utils/localStore';
import { uploadFile } from '@/api/system/upload';
import Config from '@/config/index';

export type InsertFnType = (url: string, alt: string, href: string) => void;

export const MENU_CONF = {
  ['uploadImage']: {
    server: Config.uploadUrl + 'BasePrivate/uploadFile',
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
        const response: any = await uploadFile(formData, { headers: Headers });
        if (response.code != 500) {
          insertFn(Config.uploadUrl + response.data.file_name, '', ''); // 插入图片，参数：图片 src、alt、href
        } else {
          message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error posting data:', error);
      }
    },
  },
};

export const ToolbarConfig = { excludeKeys: ['group-video'] };
