export const errorHandler = (error: unknown, context: string): void => {
  if (error instanceof Error) {
    console.error(`${context}: ${error.message}`);
  } else {
    console.error(`${context}: An unknown error occurred.`);
  }
};
