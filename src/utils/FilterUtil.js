const VALID_OPERATORS = ["gt", "eq", "lt", "gte", "lte"];

exports.filterData = (data, filters) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.filter((item) => {
    return filters.every(({ filterBy, filterValue, operator = "eq" }) => {
      // Check if the field exists
      if (!(filterBy in item)) {
        throw new Error(`Field '${filterBy}' does not exist in the data.`);
      }

      // Matching the string
      if (typeof item[filterBy] === "string") {
        return item[filterBy]
          .toLowerCase()
          .startsWith(filterValue.toLowerCase());
      }

      // Support for multiple operators
      if (Array.isArray(filterValue)) {
        return filterValue.every(({ value, op }) => {
          op = op || "eq";
          if (!VALID_OPERATORS.includes(op)) {
            throw new Error(
              `Invalid operator '${op}'. Valid operators are ${VALID_OPERATORS.join(", ")}.`
            );
          }

          return applyOperator(item[filterBy], value, op);
        });
      }

      // Single operator
      if (!VALID_OPERATORS.includes(operator)) {
        throw new Error(
          `Invalid operator '${operator}'. Valid operators are ${VALID_OPERATORS.join(", ")}.`
        );
      }

      return applyOperator(item[filterBy], filterValue, operator);
    });
  });
};

const applyOperator = (fieldValue, filterValue, operator) => {
  switch (operator) {
    case "gt":
      return fieldValue > filterValue;
    case "lt":
      return fieldValue < filterValue;
    case "gte":
      return fieldValue >= filterValue;
    case "lte":
      return fieldValue <= filterValue;
    case "eq":
    default:
      return fieldValue == filterValue;
  }
};
