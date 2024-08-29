export const getNumberOfPages = (
  tablesLenght: number,
  rowsPerPages: number,
): number => {
  const quotient = Math.floor(tablesLenght / rowsPerPages);
  const remainder = tablesLenght % rowsPerPages;
  if (remainder != 0) {
    return quotient + 1;
  }

  return quotient;
};
