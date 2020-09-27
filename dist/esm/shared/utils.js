import { getRange } from './dates';
/**
 * Returns a value no smaller than min and no larger than max.
 *
 * @param {*} value Value to return.
 * @param {*} min Minimum return value.
 * @param {*} max Maximum return value.
 */

export function between(value, min, max) {
  if (min && min > value) {
    return min;
  }

  if (max && max < value) {
    return max;
  }

  return value;
}
export function isValueWithinRange(value, range) {
  return range[0] <= value && range[1] >= value;
}
export function isRangeWithinRange(greaterRange, smallerRange) {
  return greaterRange[0] <= smallerRange[0] && greaterRange[1] >= smallerRange[1];
}
export function doRangesOverlap(range1, range2) {
  return isValueWithinRange(range1[0], range2) || isValueWithinRange(range1[1], range2);
}

function getRangeClassNames(valueRange, dateRange, baseClassName) {
  var isRange = doRangesOverlap(dateRange, valueRange);
  var classes = [];

  if (isRange) {
    classes.push(baseClassName);
    var isRangeStart = isValueWithinRange(valueRange[0], dateRange);
    var isRangeEnd = isValueWithinRange(valueRange[1], dateRange);

    if (isRangeStart) {
      classes.push("".concat(baseClassName, "Start"));
    }

    if (isRangeEnd) {
      classes.push("".concat(baseClassName, "End"));
    }

    if (isRangeStart && isRangeEnd) {
      classes.push("".concat(baseClassName, "BothEnds"));
    }
  }

  return classes;
}

export function getTileClasses() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      value = _ref.value,
      date = _ref.date,
      dateType = _ref.dateType;

  var className = 'react-calendar__tile';
  var classes = [className];

  if (!date) {
    return classes;
  }

  if (!(date instanceof Array) && !dateType) {
    throw new Error('getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed.');
  }

  var now = new Date();
  var dateRange = date instanceof Array ? date : getRange(dateType, date);

  if (isValueWithinRange(now, dateRange)) {
    classes.push("".concat(className, "--now"));
  }

  if (!value) {
    return classes;
  }

  if (!(value instanceof Array)) {
    throw new Error('value is not of type array');
  }

  var selectedDates = value; // Check if any of the selectedDates are within the current date range

  var dateIsSelected = selectedDates.reduce(function (b, d) {
    return b || isValueWithinRange(d, dateRange);
  }, false);

  if (dateIsSelected) {
    classes.push("".concat(className, "--active"));
  }
  /*
  const valueRange = value instanceof Array ? value : getRange(valueType, value);
   if (isRangeWithinRange(valueRange, dateRange)) {
    classes.push(`${className}--active`);
  } else if (doRangesOverlap(valueRange, dateRange)) {
    classes.push(`${className}--hasActive`);
  }
   const valueRangeClassNames = getRangeClassNames(valueRange, dateRange, `${className}--range`);
   classes.push(...valueRangeClassNames);
   if (hover) {
    const hoverRange = hover > valueRange[1] ? [valueRange[1], hover] : [hover, valueRange[0]];
    const hoverRangeClassNames = getRangeClassNames(hoverRange, dateRange, `${className}--hover`);
     classes.push(...hoverRangeClassNames);
  }
  */


  return classes;
}