import { getUserToken } from "../../utils/common";

class BaseService {
  protected url: string | undefined = process.env.REACT_APP_API_URL;

  protected getHeaders(){
    return{
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
      }
    }
  }
}
export default BaseService;