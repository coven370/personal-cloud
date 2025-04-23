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

  getRecentFiles(userId, router){
    const url = `/api/system/recent/${userId}`
    return this.CommonAPIService.getCall(url, null, router)
  }

  getItemByAddress(fileAddress, router){
    const url = `/api/system/address/${fileAddress}`
    return this.CommonAPIService.getCall(url, null, router)
  }

  sendMessage(convo, router){
    const url = `/api/system/ai/message`
    return this.CommonAPIService.postCall(url, convo, router)
  }
}

export default FileAPIService;
