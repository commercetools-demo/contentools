const useTest = () => {
    // Your implementation here
    const getCustomer = async (id: string) => {
      // Custom implementation
      console.log("Intercepted getCustomer call");
      return { id, name: "Custom Customer" };
    };
    
    return { getCustomer };
  };
  
export default useTest;