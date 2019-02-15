export const required = (value: any) => (value ? undefined : "Required");

export const minLength = (min: number) => (value: string) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const minLength2 = minLength(2);

export const truncate = (text: string, limit: number) =>
  text.length > limit ? `${text.substr(0, limit)}...` : text;
