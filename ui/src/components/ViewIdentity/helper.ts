export const reduceString = (input: string, reducedNumber: number) => {
  if (reducedNumber < input.length) {
    return input
      .slice(0, reducedNumber)
      .concat(".....")
      .concat(input.slice(-reducedNumber, -3));
  } else {
    return "";
  }
};
