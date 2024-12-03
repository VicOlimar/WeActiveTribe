import { AxiosRequestConfig } from "axios";
import { getUserToken } from "../../utils/common";

class BaseService {
  protected url: string | undefined = process.env.REACT_APP_API_URL;

  protected getHeaders(config: AxiosRequestConfig = {}) {
    return {
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
      },
      ...config
    }
  }
  protected getHeadersMultipart() {
    return {
      headers: {
        'authorization': `Bearer ${getUserToken()}`,
        'content-type': 'multipart/form-data'
      }
    }
  }
}
export default BaseService;