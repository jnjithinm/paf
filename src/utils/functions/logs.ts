export const logRequest = (method:string, url:string,  formData:string) => {
    console.log(`[API] Request: ${method.toUpperCase()} ${url}`);
    console.log('FormData:', formData);
  };