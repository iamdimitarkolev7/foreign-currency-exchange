import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { requestHeader } from '../../common/constants/request-header.constant';
import { ResponseStatusCode } from '../../common/enums/response-status-code.enum';

@Injectable()
export class FxClientService {

  async getData(requestUrl: string) {
    
    const { data, status } = await axios.get(requestUrl, { headers: requestHeader });
    
    if (status !== ResponseStatusCode.OK) {
      return '';
    }

    return data;
  }
}
