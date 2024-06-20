interface ValidationProps {
  fieldName: string;
  value: string;
}

const useValidation = () => {
  const validateField = ({fieldName, value}: ValidationProps) => {
    const onlyDigits = /^\d+$/;
    const nameincludeSpacesRegex = /^[a-zA-Z\s]{2,}$/;
    const alphabetsOnlyRegex = /^[a-zA-Z]+$/;
    const namesWithOrWithoutSpaces = /^[a-zA-Z\s]+$/;
    const addressRegex = /^[a-zA-Z0-9\s,.'-]*$/;
    const addressLeadRegex = /^[a-zA-Z0-9\s,/.'"-]*$/;
    const mobileNumberRegex = /^[6-9]\d{9}$/;
    //const emailRegex = /^([0-9a-zA-Z]+[_*|.*]{1}[0-9a-zA-Z]*|[_*|.*]|[0-9a-zA-Z]*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    //const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    let errorMessage = '';
    switch (fieldName) {
      case 'Email ID':
        if (value === '') {
          errorMessage = `${fieldName} is required`;
        }
        else if (!emailRegex.test(value)) {
          if (!value?.includes('@')) {
            errorMessage = `Email ID should contain the @ symbol`;
          } else if (value?.startsWith('@')) {
            errorMessage = `Email ID should not start with the @ symbol`;
          } else if (value?.endsWith('@')) {
            errorMessage = `Email ID should not end with the @ symbol`;
          } else if (value?.indexOf('@') !== value?.lastIndexOf('@')) {
            errorMessage = `Email ID should contain only one @ symbol`;
          } else if (value?.includes(' ')) {
            errorMessage = `Email ID should not contain spaces`;
          } else {
            errorMessage = `Please enter a valid email ID`;
          }
        }
        break;

      case 'Username':
        if (value === '') {
          errorMessage = `${fieldName} is required`;
        } else if (value.length < 8) {
          errorMessage = `${fieldName} should be atleast 8 characters`;
        }
        break;

      case 'Password':
      case 'Confirm Password':
        if (value === '') {
          errorMessage = `${fieldName} is required`;
        } else if (value.length < 8) {
          errorMessage = `${fieldName} should be atleast 8 characters`;
        }
        break;

      default:
        break;
    }
    return errorMessage;
  };

  return {validateField};
};

export default useValidation;
