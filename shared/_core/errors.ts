export const ForbiddenError = (message: string) => {
  const error = new Error(message);
  (error as any).code = "FORBIDDEN";
  return error;
};