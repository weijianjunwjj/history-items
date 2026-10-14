import { uploadFile } from '@/api/system/upload';
import { UploadCustomRequestOptions } from 'naive-ui';
import localStore from './localStore';

export const Headers = {
  'X-TOKEN': localStore.get('token'),
};

export interface UploadFileInfo {
  batchId: string;
  name: string;
  url?: string | null;
}

export const UploadImgAccept = 'image/jpeg,image/png';
export const IsLt = '文件大小必须小于 ${size}MB!';
export const UploadVideoAccept = 'video/mp4,video/x-msvideo';
export const UploadAcceptWarn = '您只能上传 ${type} 文件!';
export const ScaleWarn = "您只能上传指定长宽比的图片"

// 确保批次ID (batchId) 也被适当处理，这里简单处理为 null

export function uploadService(options: UploadCustomRequestOptions) {
  return new Promise<UploadFileInfo>((resolve, reject) => {
    const { file, data, headers, action, onProgress, onFinish, onError } =
      options;

    const formData = new FormData();
    if (data) {
      for (const key in data) {
        formData.append(key, data[key]);
      }
    }
    formData.append('file', file.file as Blob, file.name);
    uploadFile(formData, { headers: headers || Headers })
      .then(res => {
        console.log('file', file)
        const uploadFile = {
          batchId: file.id,
          url: res.data.file_name,
          name: res.data.file_name,
        };

        window.$message.success('上传成功');
        resolve(uploadFile);
        onFinish();
      })
      .catch(error => {
        window.$message.error(error.message || '上传失败');
        reject(error);
        onError();
      });
  });
}

export function checkFileSize(file: any, size: number):boolean {
  const ok = (file.file.file.size / 1024 / 1024) < size;
  if (!ok) {
    window.$message.warning(IsLt.replace('${size}', size as string));
    return false;
  }

  return true; // 返回 true 允许上传
}

export function checkFileType(file: any, accept: string):boolean {
  const ok = accept.split(',').includes(file.file.type);
  if (!ok) {
    window.$message.warning(UploadAcceptWarn.replace('${type}', accept));
    return false;
  }

  return true; // 返回 true 允许上传
}

export function checkImgRatio(file, ratio: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file.file.file);
    image.onload = () => {
      const currentRatio = (image.width / image.height).toFixed(1);
      if (currentRatio != ratio) {
        URL.revokeObjectURL(file);
        window.$message.warning(ScaleWarn);
        return resolve(false);
      }else{
        return resolve(true);
      }
    };
  });
}

