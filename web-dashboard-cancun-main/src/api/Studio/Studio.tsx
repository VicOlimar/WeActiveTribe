import { Model, Response } from "../Service/Service";
import axios from "axios";
import { Place } from "../Place/Place";
import { ILessonFilters } from "../../shared/types/ILessonFilter";
import { Lesson } from "../Lesson/Lesson";
import BaseService from "../BaseService";

export interface Studio extends Model {
	name: string;
	slug: string;
}

export interface StudioWithPlaces extends Studio {
	places: Place[];
}

class StudioService extends BaseService {
	protected name = "studio";
	protected url: string | undefined = process.env.REACT_APP_API_URL;

	async find(): Promise<Studio[] | null> {
		try {
			const response = await axios.get<Response<Studio>>(`${this.url}/studio`);
			const { data: axiosData } = response;
			return axiosData.data as Studio[];
		} catch (error) {
			return null;
		}
	}

	async findOne(slug: string | string): Promise<StudioWithPlaces | undefined> {
		try {
			const response = await axios.get<Response<StudioWithPlaces>>(
				`${this.url}/studio/${slug}`
			);
			const { data: axiosData } = response;
			return axiosData.data as StudioWithPlaces;
		} catch (error) {
			return undefined;
		}
	}

	async create(instance: Studio): Promise<Studio> {
		const response = await axios.get<Response<Studio>>(`${this.url}/studio/`);
		return response.data.data as Studio;
	}

	async report(options: ILessonFilters): Promise<Lesson[]> {
		const response = await axios.get(
			`${this.url}/${this.name}/report`,
			this.getHeaders({ params: options })
		);
		return response.data.data as Lesson[];
	}
}

const service = new StudioService();
export default service;
