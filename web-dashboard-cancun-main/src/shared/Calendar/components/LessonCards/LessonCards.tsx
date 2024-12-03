import React from "react";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import "./LessonCards.scss";
import { Lesson } from "../../../../api/Lesson/Lesson";
import Loader from "../../../Loader";
import { Instructor } from "../../../../api/Instructor/Instructor";
import { isUndefined } from "util";


type Props = {
  onClick?: Function;
  lessons: Array<Lesson>;
  loading?: boolean;
  selectedInstructor?: Instructor;
  currentDate: Date;
};

function createWeekLessonsArray(lessons: Array<Lesson>, currentDate: Date) {
  const weekStart = moment(currentDate).startOf('day');
  const weekDays = 7;
  var lessonsMap = new Map();

  for (let weekDay = 1; weekDay <= weekDays; weekDay++) {
    const dayLessons = lessons.filter(lesson => {
      return moment(lesson.starts_at).tz("America/Merida").toDate().getDate() === weekStart.date();
    });
    lessonsMap.set(weekStart.date(), dayLessons);
    weekStart.add(1, "days");
  }
  return lessonsMap;
}

function getMaxLessonsNumber(lessonsMap: Map<Number, Array<Lesson>>) {
  let maxLessons = 0;
  lessonsMap.forEach((lessons, date) => {
    if (lessons.length > maxLessons) {
      maxLessons = lessons.length;
    }
  });
  return maxLessons;
}

function displayLessonsByDay(
  lessonsMap: Map<Number, Array<Lesson>>,
  onClick?: Function,
  selectedInstructor?: Instructor
) {
  const maxLessons = getMaxLessonsNumber(lessonsMap);
  const rows: Array<Object> = [];
  for (let iteration = 0; iteration < maxLessons; iteration++) {
    let columns: Array<Object> = [];
    lessonsMap.forEach((lessons, date) => {
      if (lessons.length > 0)
        columns.push(
          <LessonColumn
            key={`${date} - ${lessons.length}`}
            lesson={lessons[iteration]}
            onClick={onClick}
            selectedInstructor={selectedInstructor}
          />
        );
      else columns.push(<Col key={`${date} - ${iteration}`}></Col>);
    });
    rows.push(
      <Row key={iteration} className="" noGutters>
        {columns}
      </Row>
    );
  }
  return rows;
}

const LessonColumn = ({
  lesson,
  onClick,
  selectedInstructor
}: {
  lesson: Lesson;
  onClick?: Function;
  selectedInstructor?: Instructor;
}) => {
  let cardClass = "";
  if (lesson) {
    cardClass =
      lesson.available === 0
        ? "lesson__card-not-available"
        : "lesson__card-normal";
  } else cardClass = "lesson__card-not-available";

  let cardColor = '';

  if (lesson)
    if (lesson.studio.slug === 'we-hiit') {
      cardColor = `blue`;
    } else cardColor = `pink`;

  let instructorsName: string = '';
  if (lesson) {
    const instructorsNameArray: string[] = lesson.instructors.map((instructor) => {
      return instructor.name;
    });
    instructorsName = instructorsNameArray.join(', ');
  }

  return (
    <Col>
      {lesson ? (
        <div
          className={`${cardClass} ${cardColor}`}
          onClick={onClick ? () => onClick(lesson) : () => { }}
          style={getCardOpacity(lesson, selectedInstructor)}
        >
          <p className={`${cardClass}__name text-center`}>
            {instructorsName}
          </p>
          <p className={`${cardClass}__lessons text-center`}>
            {lesson.available === 0 || lesson.available === undefined
              ? "Clase llena"
              : `${lesson.available} lugares disponibles`
            }
          </p>
          <p className={`${cardClass}__name text-center`}>
            {lesson.name
              ? lesson.name
                ? lesson.name
                : ""
              : ""}
          </p>
          <p className={`${cardClass}__hour text-center`}>
            {moment(lesson!.starts_at).utcOffset('-05:00').format("h:mm A")}
          </p>
        </div>
      ) : (
          ""
        )}
    </Col>
  );
};

function getCardOpacity(lesson: Lesson, selectedInstructor?: Instructor) {
  if (isUndefined(selectedInstructor)) {
    return { opacity: 1 };
  } else {
    return {
      opacity: selectedInstructor.id === lesson.instructor_id ? 1 : 0.4
    };
  }
}

const EmptyLessons = () => {
  return (
    <div className="lessons-empty">
      <h4>¡Ups! Parece que no tenemos clases</h4>
    </div>
  );
};

const LessonCards = ({
  lessons,
  onClick,
  loading = false,
  selectedInstructor,
  currentDate,
}: Props) => {
  const daysLessonsMap = createWeekLessonsArray(lessons, currentDate);
  return (
    <div className="lessons">
      {loading && <Loader></Loader>}
      {!loading && lessons.length === 0 && <EmptyLessons />}
      {displayLessonsByDay(daysLessonsMap, onClick, selectedInstructor)}
    </div>
  );
};

export default LessonCards;
