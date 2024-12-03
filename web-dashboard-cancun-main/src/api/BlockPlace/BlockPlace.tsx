import { Response } from '../Service/Service';
import axios from 'axios';
import BaseService from '../BaseService';

export interface BlockedPlace {
    blockedAt: Date,
    placeId: number,
    lessonId: number
}

class BlockedPlaceService extends BaseService {
    async create(lessonId: number, placeId: number, visible: boolean = true): Promise<BlockedPlace | undefined> {
        try {
            const response = await axios.post<Response<any>>(
                `${this.url}/block`,
                {
                    lesson_id: lessonId,
                    place_id: placeId,
                    visible
                },
                this.getHeaders()
            )
            return response.data.data as BlockedPlace;
        } catch (error) {
            return error.response.data.message;
        }
    }

    async unlock(blockedPlaceId: number) {
        try {
            const response = await axios.delete<Response<any>>(
                `${this.url}/block/${blockedPlaceId}`,
                this.getHeaders()
            )

            return response.data.data as BlockedPlace;
        } catch (error) {
            return error.message;
        }
    }

    async enable(blockerPlaceId: number) {
        try {
            await axios.delete<Response<any>>(
                `${this.url}/block/enable/${blockerPlaceId}`,
                this.getHeaders()
            )
        } catch (error) {
            return error.message;
        }
    }
}


export default new BlockedPlaceService();