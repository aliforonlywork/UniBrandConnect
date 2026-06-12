import { useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const ReferralRedirect = () => {

  const { code } = useParams();

  useEffect(() => {

    const openProduct = async () => {

      try {

        console.log("Referral Code:", code);

        const res = await API.get(
          `/referrals/${code}`
        );

        console.log(res.data);

        window.location.href =
          `/product/${res.data.campaignId}`;

      } catch (error) {

        console.error(
          error.response?.data || error
        );

        alert("Invalid referral link");
      }
    };

    openProduct();

  }, [code]);

  return <h2>Redirecting to product...</h2>;
};

export default ReferralRedirect;