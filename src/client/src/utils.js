export const searchAPI = async (inputText, pagination, successCb, errorCb) => {
  const { offset, limit } = pagination;
  try {
    const response = await fetch(
      `/search?q=${encodeURIComponent(inputText)}&o=${offset}&l=${offset + limit}`,
    );
    const searchResults = await response.json();
    successCb(searchResults)
  } catch (e) {
    alert('Unexpected error, try again');
    errorCb(e);
  }
};