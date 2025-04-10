import { CommonAPIService } from './CommonHandler';

export class FileAPIService {
  constructor() {
    this.CommonAPIService = new CommonAPIService();
  }

  getHomeDirectoryForUser(userId, router) {
    const url = `/api/system/home/${userId}`;
    return this.CommonAPIService.getCall(url, '', router);
  }

  getContentsOfFolder(folderId, router) {
    const url = `/api/system/contents/${folderId}`;
    return this.CommonAPIService.getCall(url, '', router);
  }

  createFolderForUser(parentFolderId, userId, router){
    const url = `/api/system/folder/${parentFolderId}/${userId}`
    return this.CommonAPIService.postCall(url, '', router)
  }

  updateItem(data, id, router){
    const url = `/api/system/items/${id}`
    return this.CommonAPIService.postCall(url, data, router)
  }

  deleteItems(ids, router){
    const url = `/api/system/items/`
    return this.CommonAPIService.postCall(url, ids, router)
  }
}

export default FileAPIService;
