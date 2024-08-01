exports.sortData = (data, sortBy, sortOrder) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Sorting the data
  if (!sortBy) {
    return data;
  }

  //checking if the field exists
  if (!(sortBy in data[0])) {
    throw new Error(`Field '${sortBy}' does not exist in the data.`);
  }

  //sorting the data
  if (sortOrder.toLowerCase() === "asc") {
    return data.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
  } else if (sortOrder.toLowerCase() === "desc") {
    return data.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
  } else {
    throw new Error(
      `Invalid sortOrder '${sortOrder}'. Valid values are 'asc' or 'desc'.`
    );
  }
};
