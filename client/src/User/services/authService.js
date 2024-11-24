export const getCurrentUserID = () => {
    const userID = localStorage.getItem('userId');
    // console.log('Retrieved userID:', userID);
    return userID;
  };
  
  export const getCurrentUsername = () => {
    return localStorage.getItem('username') || '';
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  };
  