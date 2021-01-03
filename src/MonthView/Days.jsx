import React from 'react';
import PropTypes from 'prop-types';
import {
  getYear,
  getMonth,
  getDaysInMonth
} from '@wojtekmaj/date-utils';

import TileGroup from '../TileGroup';
import Day from './Day';

import { getDayOfWeek } from '../shared/dates';
import { isCalendarType, tileGroupProps } from '../shared/propTypes';

export default function Days(props) {
  const {
    activeStartDate,
    calendarType,
  } = props;
  const {
    showFixedNumberOfWeeks,
    showNeighboringMonth,
    hideDatesOlderThanMin,
    minDate,
    ...otherProps
  } = props;

  const year = getYear(activeStartDate);
  const monthIndex = getMonth(activeStartDate);
  const minMonthYear = minDate ? getYear(minDate) : -1;
  const minMonthIndex = minDate ? getMonth(minDate) : -1;

  const hasFixedNumberOfWeeks = showFixedNumberOfWeeks || showNeighboringMonth;
  const dayOfWeek = getDayOfWeek(activeStartDate, calendarType);

  const offset = hasFixedNumberOfWeeks ? 0 : dayOfWeek;

  /**
   * Defines on which day of the month the grid shall start. If we simply show current
   * month, we obviously start on day one, but if showNeighboringMonth is set to
   * true, we need to find the beginning of the week the first day of the month is in.
   */
  const start = (() => {
    if (hideDatesOlderThanMin && minMonthYear === year && minMonthIndex === monthIndex) {
      // If we are in the minimum month, then start the calendar at the first day of
      // the min date's week.
      return minDate.getDate() - getDayOfWeek(minDate, calendarType);
    }
    return (hasFixedNumberOfWeeks ? -dayOfWeek : 0) + 1;
  })();

  /**
   * If we are hiding at-least first week in the month, show all days as the current "month".
    */
  const showNeighboringMonthAsCurrent = (() => {
    console.log('Start: ', start);
    if (start >= 8) {
      return true;
    }
    return false;
  })

  /**
   * Defines on which day of the month the grid shall end. If we simply show current
   * month, we need to stop on the last day of the month, but if showNeighboringMonth
   * is set to true, we need to find the end of the week the last day of the month is in.
   */
  const end = (() => {
    if (showFixedNumberOfWeeks) {
      // Always show 4 weeks
      return start + (5 * 7) - 1;
    }

    const daysInMonth = getDaysInMonth(activeStartDate);

    if (showNeighboringMonth) {
      const activeEndDate = new Date();
      activeEndDate.setFullYear(year, monthIndex, daysInMonth);
      activeEndDate.setHours(0, 0, 0, 0);
      const daysUntilEndOfTheWeek = 7 - getDayOfWeek(activeEndDate, calendarType) - 1;
      return daysInMonth + daysUntilEndOfTheWeek;
    }

    return daysInMonth;
  })();

  return (
    <TileGroup
      {...otherProps}
      className="react-calendar__month-view__days"
      count={7}
      currentMonthIndex={monthIndex}
      dateTransform={(day) => {
        const date = new Date();
        date.setFullYear(year, monthIndex, day);
        date.setHours(0, 0, 0, 0);
        return date;
      }}
      dateType="day"
      end={end}
      offset={offset}
      start={start}
      tile={Day}
    />
  );
}

Days.propTypes = {
  calendarType: isCalendarType.isRequired,
  showFixedNumberOfWeeks: PropTypes.bool,
  ...tileGroupProps,
};
