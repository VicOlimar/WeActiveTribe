import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import InstructorService from "../../api/Instructor";
import { Instructor } from "../../api/Instructor/Instructor";
import { Lesson } from "../../api/Lesson/Lesson";
import { ILessonFilters } from "../../shared/types/ILessonFilter";
import StudioService, { Studio } from "./../../api/Studio/Studio";
import Filters from "./Filters";
import ReportTable from "./ReportTable";
import ExcelReport from "./ExcelReport";

const LessonsReport = () => {
	const [report, setReport] = useState<Lesson[]>([]);
	const [studios, setStudios] = useState<Studio[] | undefined>([]);
	const [instructors, setInstructor] = useState<Instructor[]>([]);

	useEffect(() => {
		getStudios();
		getInstructors();
	}, []);

	const getStudios = async () => {
		try {
			const response = await StudioService.find();
			const updateResponse = response?.filter((studio: Studio) => studio.slug !== 'online');
			if (response) {
				setStudios(updateResponse);
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const getInstructors = async () => {
		try {
			const response = await InstructorService.find(300, 1);
			if (response) {
				setInstructor(response.instructors);
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const onGenerateReport = async ({
		studio_id,
		instructor_id,
		start_date,
		end_date,
	}: ILessonFilters) => {
		try {
			const body = {
				studio_id,
				instructor_id,
				start_date: moment(start_date).startOf("day").toDate(),
				end_date: moment(end_date).endOf("day").toDate(),
			};
			const response = await StudioService.report(body);
			setReport(response);
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<div className="lessons_report">
			<h1 className="header-title">REPORTE DE CLASES</h1>
			<Filters studios={studios} onFilter={onGenerateReport} instructors={instructors} />
			<hr />
			<ExcelReport report={report} />
			<br />
			<ReportTable report={report} />
		</div>
	);
};

export default LessonsReport;
