export const logRequest = (method:string, url:string,  formData:string) => {
  console.log(`[API] Request: ${method.toUpperCase()} ${url}`);
  console.log('FormData:', formData);
};

export const filterPayload = <T extends object>(payload: T): Partial<T> => {
    return Object.keys(payload).reduce((acc, key) => {
      const value = (payload as any)[key];
      if (value !== undefined && value !== null) {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<T>);
  };
  