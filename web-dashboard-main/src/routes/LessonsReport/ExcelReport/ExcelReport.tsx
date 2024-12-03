import moment from "moment-timezone";
import React from "react";
import ReactExport from "react-export-excel";
import { Button } from "react-bootstrap";
import { Lesson } from "../../../api/Lesson/Lesson";
import { Instructor } from "../../../api/Instructor/Instructor";
import { isNullOrUndefined } from "util";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

interface IExcelReport {
	report: Lesson[];
}

const today = () => moment()
  .utcOffset("-06:00")
  .format("D [de] MMMM [-] hh:mm A");

const className = (name: string): string => {
  return isNullOrUndefined(name) || name === '' ? "N/D" : name;
}

const ExcelReport = ({ report }: IExcelReport) => {
	return (
    <ExcelFile filename={ `Reporte de clases - ${ today() }`  } element={<Button style={{ height: "40px" }} disabled={report.length === 0}>Descargar reporte</Button>}>
      <ExcelSheet data={report} name="Clases">
          <ExcelColumn label="Estudio" value={(row: Lesson) => row.studio.name } />
          <ExcelColumn label="Nombre" value={(row: Lesson) => className(row.name)} />
          <ExcelColumn label="Coach" value={(row: Lesson) => row.instructors.map(({ name }: Instructor) => name).join(", ") } />
          <ExcelColumn label="Experiencia" value={(row: Lesson) => row.instructors.map(({ experience }: Instructor) => experience).join(", ") } />
          <ExcelColumn label="Fecha" value={(row: Lesson) => moment(row.starts_at).utcOffset("-06:00").toDate() } />
          <ExcelColumn label="Asistentes" value={(row: Lesson) => row.reserved_places.length } />
          <ExcelColumn label="Cortesías" value={(row: Lesson) => row.courtesies } />
      </ExcelSheet>
    </ExcelFile>
	);
};

export default ExcelReport;
