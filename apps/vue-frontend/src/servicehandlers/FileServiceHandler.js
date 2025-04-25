import { CommonAPIService } from './CommonHandler';

export class FileAPIService {
  constructor() {
    this.CommonAPIService = new CommonAPIService();
  }

  downloadFile(filename, type, id, router) {
    const url = `/api/files/${filename}/download`;
    return this.CommonAPIService.newFileCall(url, '', router);
  }

  uploadFile(params, folderId, userId, router) {
    const url = `/api/files/${folderId}/${userId}`;
    return this.CommonAPIService.fileCall(url, params, router);
  }

  getFile(filename, router){
    const url = `/api/files/${filename}`
    return this.CommonAPIService.getCall(url, null, router)
  }

  deleteFile(id, filename, router) {
    const url = `/api/claims/${id}/${filename}/delete`;
    return this.CommonAPIService.deleteCall(url, null, router);
  }
}

export default FileAPIService;
