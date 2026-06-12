import { useState } from "react";

const usePagination = (data = [], itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentData,
  };
};

export default usePagination;