import React, { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Alert from "../../../shared/alert/index";
import DatePicker from "react-datepicker";
import { ILessonFilters } from "../../../shared/types/ILessonFilter";
import { Studio } from "../../../api/Studio/Studio";
import { Instructor } from "../../../api/Instructor/Instructor";

const { Control, Label } = Form;

interface IFilters {
	onFilter: (values: ILessonFilters) => void;
	studios: Studio[] | undefined;
	instructors: Instructor[];
}

const Filters = ({ onFilter, studios, instructors }: IFilters) => {
	const allElementsString = "Todos";
	const [error, setError] = useState<string | undefined>(undefined);
	const [studio, setStudio] = useState<string | undefined>(undefined);
	const [instructor, setInstructor] = useState<string | undefined>(undefined);
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);

	const onStudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value !== allElementsString) {
			setStudio(event.target.value);
		} else {
			setStudio(undefined);
		}
	};

	const onInstructorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value !== allElementsString) {
			setInstructor(event.target.value);
		} else {
			setInstructor(undefined);
		}
	};

	const onDateChange =
		(callback: Dispatch<SetStateAction<Date | undefined>>) => (date: Date) =>
			callback(date);

	const handleSubmit = () => {
		if (!isValid()) {
			setError("La fecha de inicio y fecha de fin son requeridas.");
			return;
		}
		onFilter({
			studio_id: isValidStudio() ? Number(studio) : null,
			instructor_id: isValidInstructor() ? Number(instructor) : null,
			start_date: startDate!,
			end_date: endDate!,
		});
	};

	const isValidStudio = (): boolean =>
		studio !== allElementsString && studio !== undefined;

	const isValidInstructor = (): boolean =>
		instructor !== allElementsString && instructor !== undefined;

	const isValid = (): boolean =>
		startDate !== undefined && endDate !== undefined;

	const closeAlert = () => setError(undefined);

	return (
		<Row className="align-items-end">
			{error && (
				<Alert
					message={error}
					variant={"warning"}
					parentHandleClose={closeAlert}
				></Alert>
			)}
			<Col xs={12} md={6} lg={3}>
				<Label className="purchase__search-grid__label2">
					Filtrar por estudio
				</Label>
				<Control
					className="purchase__search-grid__filter2"
					as="select"
					value={studio}
					onChange={onStudioChange}
				>
					<option value={undefined}>Todos</option>
					{studios?.filter(({ name }) => name === 'WE RIDE').map(({ id, name }: Studio) => <option key={id} value={id}>{name}</option>)}
				</Control>
			</Col>
			<Col xs={12} md={6} lg={3}>
				<Label className="purchase__search-grid__label2">
					Filtrar por instructor
				</Label>
				<Control
					className="purchase__search-grid__filter2"
					as="select"
					value={instructor}
					onChange={onInstructorChange}
				>
					<option value={undefined}>Todos</option>
					{instructors.map(({ id, name }: Instructor) => (
						<option value={id}>{name}</option>
					))}
				</Control>
			</Col>
			<Col xs={12} md={6} lg={2}>
				<Label className="purchase__search-grid__label2">Fecha de inicio</Label>
				<br />
				<DatePicker
					selected={startDate}
					onChange={onDateChange(setStartDate)}
				/>
			</Col>
			<Col xs={12} md={6} lg={2}>
				<Label className="purchase__search-grid__label2">Fecha de fin</Label>
				<br />
				<DatePicker selected={endDate} onChange={onDateChange(setEndDate)} />
			</Col>
			<Col>
				<Button style={{ height: "40px" }} onClick={handleSubmit}>
					Generar reporte
				</Button>
			</Col>
		</Row>
	);
};

export default Filters;
