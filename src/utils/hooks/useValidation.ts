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
        } else if (!emailRegex.test(value)) {
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

      case 'Name':
        if (value === '') {
          errorMessage = `${fieldName} is required`;
        } else if (value.length < 3) {
          errorMessage = `${fieldName} should be atleast 8 characters`;
        }
        break;

      case 'District':
        if (value === '') {
          errorMessage = `${fieldName} is required`;
        }
        break;
      case 'Area':
        // if (value === '') {
        //   errorMessage = `${fieldName} is required`;
        // } 
        break;

      case 'Mobile Number':
      case 'Phone Number':
        let length = value?.length;
        if (value === '') {
          errorMessage = `Mobile Number is required`;
        } else if (!mobileNumberRegex.test(value)) {
          if (!onlyDigits.test(value)) {
            errorMessage = 'Only digit values are allowed for a Mobile Number.';
          }
          if (
            !value?.startsWith('6') &&
            !value?.startsWith('7') &&
            !value?.startsWith('8') &&
            !value?.startsWith('9')
          ) {
            errorMessage = `A Mobile Number(+91) should starts with a digit between 6 and 9.`;
          } else if (length !== 10) {
            errorMessage = 'A Mobile Number(+91) should contain 10 digits.';
          } else {
            errorMessage = 'Invalid Mobile Number';
          }
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
