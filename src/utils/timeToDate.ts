export default function timeToDate(value: string) {
  const [hours, minutes] = value.split(':');
  const date = new Date();
  date.setHours(+hours);
  date.setMinutes(+minutes);
  date.setSeconds(0);
  return date;
}
