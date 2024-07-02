/**
 * @description This function formates the date into YYYY-MM-DDTHH:MM:SS:mmmmZ
 * @returns 
 */
export const getFormattedDate = () => {
  const transformedDate = new Date().toString().split(' ');
  const mergedString = transformedDate.slice(0, 5).join(' ');
  return mergedString;
};
