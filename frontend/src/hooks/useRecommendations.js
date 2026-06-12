import { useEffect, useState } from "react";

import {
  fetchRecommendations,
} from "../services/recommendationService";

const useRecommendations = () => {

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH AI RECOMMENDATIONS
  // ==========================================

  useEffect(() => {

    const loadRecommendations =
      async () => {

      try {

        const res =
          await fetchRecommendations();

        // =====================================
        // UPDATED RESPONSE STRUCTURE
        // =====================================

        setData(
          res.campaigns || []
        );

      } catch (err) {

        console.error(
          "Recommendation Hook Error:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    loadRecommendations();

  }, []);

  return {
    data,
    loading,
  };
};

export default useRecommendations;