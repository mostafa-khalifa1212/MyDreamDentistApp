// client/src/utils/validations.js
export const validateEmail = (email) => {
    // Simple regex for email validation
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };
  
  export const validatePhoneNumber = (number) => {
    // Regex for Egyptian (+20), Saudi (+966), and UAE (+971)
    const regex = /^(\+20|00201)[0-9]{9}$|^(\+966|00966)[0-9]{9}$|^(\+971|00971)[0-9]{9}$/;
    return regex.test(number);
  };
  