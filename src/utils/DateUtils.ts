import moment from 'moment';

export const formatDateFromNow = (date: Date): string => {
  return moment(date).fromNow();
};