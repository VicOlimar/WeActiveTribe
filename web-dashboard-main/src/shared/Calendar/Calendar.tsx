import React, { Component } from "react";
import CalendarHeader from "../AppHeader";
import moment from "moment-timezone";
import "./Calendar.scss";
import DaysHeader from "./components/DaysHeader/DaysHeader";
import LessonCards from "./components/LessonCards";
import { Lesson } from "../../api/Lesson/Lesson";
import VerticalLine from "../Line";
import { Icon } from '@mdi/react';
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import DateDropdown from './components/MonthDropDown';
import { month, year } from './components/MonthDropDown/MonthDropdown';

type Day = {
  name: String;
  date: String;
};

const months: month[] = [
  { name: 'enero', id: 0 },
  { name: 'febrero', id: 1 },
  { name: 'marzo', id: 2 },
  { name: 'abril', id: 3 },
  { name: 'mayo', id: 4 },
  { name: 'junio', id: 5 },
  { name: 'julio', id: 6 },
  { name: 'agosto', id: 7 },
  { name: 'septiembre', id: 8 },
  { name: 'octubre', id: 9 },
  { name: 'noviembre', id: 10 },
  { name: 'diciembre', id: 11 },
]

type Props = {
  currentDate: Date;
  lessons: Lesson[];
  onClick?: Function;
  loading?: boolean;
  getWeekClick?: (date: Date) => void;
};

type State = {
  currentDate: Date;
  years: year[];
}

class Calendar extends Component<Props, State>{
  DATE_FORMAT = 'D [de] MMMM [-] h:mm A';
  constructor(props: Props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      years: []
    }
  }
  rangeYear = () => {
    const currentYear = new Date().getFullYear()
    const firstYear = 2019;
    const years = []

    for (let i = firstYear, j = 1; i <= currentYear; i++, j++) {
      let year = { id: j, year: i }
      years.push(year)
    }
    this.setState({ years })
  }

  async componentDidMount() {
    this.rangeYear()
    if (this.props.getWeekClick) {
      this.props.getWeekClick(
        moment(this.props.currentDate).toDate()
      )
    }
  }
  /**
   * Function for create the Days Header Array for the Calendar
   * @returns Array<Day>
   */
  retrieveDays() {
    const weekStart = moment(this.props.currentDate).startOf('day');
    const weekDays = 7;
    const days: Array<Day> = [];
    for (let weekDay = 1; weekDay <= weekDays; weekDay++) {
      const day: Day = {
        name: this.capitalize(weekStart.format("dddd")),
        date: weekStart.format("DD")
      };
      days.push(day);
      weekStart.add(1, "days");
    }
    return days;
  }

  /**
   * Get the interval string for the week
   * @returns String
   */
  getCalendarDatesInterval(starts: number, ends: number, month: string) {
    return `${starts} - ${ends} de ${month}`;
  }

  /**
   * Capitalize the first word of the string
   * @param word String
   * @returns String
   */
  capitalize(word: String) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  /**
   * Get the last day of the current week
   * @returns MomentDate
   */
  getWeekLastDay(days: number = 6) {
    return moment()
      .startOf('month')
      .add(days, "days")
      .endOf("day")
  }
  /**
   * Returns the calendar dates left header
   * @returns ReactComponent
   */
  getCalendarHeader() {
    const { currentDate } = this.props;
    const startDate = moment(currentDate);
    const endDate = moment(currentDate);

    return (
      <div className="inline-flex calendar__header">
        <span onClick={() => {
          this.prevWeekOrMonth();
        }}> <Icon path={mdiChevronLeft} title='Previous' size={1} color='#ffffff'></Icon>Anterior </span>
        <VerticalLine />
        <span>
          {this.getCalendarDatesInterval(startDate.date(), endDate.add(6, 'days').date(), endDate.format('MMMM / YYYY'))}
        </span>
        <VerticalLine />
        <span onClick={() => {
          this.nextWeekOrMonth();
        }}> Siguiente <Icon path={mdiChevronRight} title='Previous' size={1} color='#ffffff'></Icon>  </span>
      </div>
    );
  }

  nextWeekOrMonth = () => {
    const { currentDate } = this.props;
    const nextDate = moment(currentDate).add(7, 'days');
    this.setState({ currentDate: nextDate.toDate() },
      () => {
        if (this.props.getWeekClick) {
          this.props.getWeekClick(
            this.state.currentDate
          )
        }
      });
  }

  prevWeekOrMonth = () => {
    const { currentDate } = this.props;
    const nextDate = moment(currentDate).subtract(7, 'days');
    this.setState({ currentDate: nextDate.toDate() },
      () => {
        if (this.props.getWeekClick) {
          this.props.getWeekClick(
            this.state.currentDate
          )
        }
      });
  }

  setMonth = (month: month) => {
    this.setState({ currentDate: moment(this.state.currentDate).month(month.id).toDate() }, () => {
      if (this.props.getWeekClick)
        this.props.getWeekClick(
          this.state.currentDate
        );
    });
  }

  setYear = (year: year) => {
    this.setState({ currentDate: moment(this.state.currentDate).year(year.year).toDate()}, () => {
      if (this.props.getWeekClick)
        this.props.getWeekClick(
          this.state.currentDate
        )
    })
  }

  getMonthsDropdown() {
    return <DateDropdown
      dropDownText='Mes'
      dropDownItems={months}
      onClick={this.setMonth}
    />
  }

  getYearsDropdown() {
    return <DateDropdown
        dropDownText='Año'
        dropDownItems={this.state.years}
        onClick={this.setYear}
      />
  }

  render() {
    return (
      <div className="calendar">
        <CalendarHeader
          leftComponent={this.getCalendarHeader()}
          monthComponent={this.getMonthsDropdown()}
          yearComponent={this.getYearsDropdown()}
        />
        <div className="calendar__body">
          <DaysHeader days={this.retrieveDays()} />
          <LessonCards
            lessons={this.props.lessons}
            onClick={this.props.onClick}
            loading={this.props.loading}
            currentDate={this.props.currentDate}
          />
        </div>
      </div>
    );
  }
};
export default Calendar;