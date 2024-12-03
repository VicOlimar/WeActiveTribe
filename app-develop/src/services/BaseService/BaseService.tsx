import { getUserToken } from "../../utils/common";
import { API_URL } from 'react-native-dotenv';

class BaseService {
  protected url: string | undefined = API_URL;
  protected async getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${await getUserToken()}`,
      }
    }
  }
}
export default BaseService;
