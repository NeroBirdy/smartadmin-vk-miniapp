export const useSelectedDate = () => {
  const selectedDate = useState<Date>('selectedDate', () => new Date());
  const currentDate = useState<Date>('currentDate', () => new Date());
  
  const setSelectedDate = (date: Date) => {
    selectedDate.value = date;
  };
  
  return {
    selectedDate,
    setSelectedDate,
    currentDate
  };
};