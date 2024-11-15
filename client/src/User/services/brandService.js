export const fetchBrands = async () => {
  try {
    const response = await fetch('/api/brands'); 
    if (!response.ok) throw new Error('Failed to fetch brands');
    const data = await response.json();
    console.log("Fetched brands:", data); // Để kiểm tra dữ liệu được lấy
    return data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};
