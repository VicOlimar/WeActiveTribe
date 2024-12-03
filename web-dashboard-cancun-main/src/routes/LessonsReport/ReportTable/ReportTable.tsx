import moment from "moment-timezone";
import React from "react";
import { Table } from "react-bootstrap";
import { Instructor } from "../../../api/Instructor/Instructor";
import { Lesson } from "../../../api/Lesson/Lesson";

const LessonRow = ({ lesson, number }: { lesson: Lesson; number: number }) => (
	<tr>
		<td>{number}</td>
		<td>{lesson.studio.name}</td>
		<td>{lesson.name ?? "N/D"}</td>
		<td>{lesson.instructors.map(({ name }: Instructor) => name).join(",")}</td>
		<td>{lesson.instructors.map(({ experience }: Instructor) => experience ? experience : 'Sin clasificar').join(",")}</td>
		<td>
			{moment(lesson.starts_at)
				.tz("America/Merida")
				.format("D [de] MMMM [-] h:mm A")}
		</td>
		<td>{lesson.reserved_places.length}</td>
		<td>{lesson.courtesies}</td>
	</tr>
);

interface IReportTable {
	report: Lesson[];
}

const ReportTable = ({ report }: IReportTable) => {
	return (
		<Table className="reservations__table" bordered hover>
			<thead>
				<tr>
					<th>#</th>
					<th>Estudio</th>
					<th>Nombre</th>
					<th>Coach</th>
					<th>Experiencia</th>
					<th>Fecha</th>
					<th>Asistentes</th>
					<th>Cortesías</th>
				</tr>
			</thead>
			<tbody>
				{report.map((lesson: Lesson, index: number) => (
					<LessonRow key={lesson.id} number={index + 1} lesson={lesson} />
				))}
				{report.length === 0 && (
					<tr>
						<td className="text-center" colSpan={8}>
							Sin resultados
						</td>
					</tr>
				)}
			</tbody>
		</Table>
	);
};

export default ReportTable;
