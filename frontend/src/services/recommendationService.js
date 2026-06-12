import API from "./api";

// ==========================================
// FETCH AI RECOMMENDATIONS
// ==========================================

export const fetchRecommendations =
  async () => {

  try {

    const response =
      await API.get(
        "/campaigns/student/recommendations"
      );

    return response.data;

  } catch (error) {

    console.error(
      "Recommendation Service Error:",
      error
    );

    throw error;
  }
};