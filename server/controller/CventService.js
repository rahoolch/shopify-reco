const axios = require("axios");

exports.order = async function (req, res) {
  const { customerId } = req.body;

  const url = `${process.env.SHOPIFY_API_URL}/customers/${encodeURIComponent(
    customerId
  )}/orders.json`;

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url,
    headers: {
      "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
    },
  };

  try {
    const response = await axios.request(config);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      console.log("API Error Response:", error.response.data);
      return res.status(error.response.status || 500).json(error.response.data);
    } else {
      console.error("Unexpected Error:", error.message);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

exports.customer = async function (req, res) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }
  const url = `${
    process.env.SHOPIFY_API_URL
  }/customers/search.json?query=phone%3A${encodeURIComponent(phone)}&fields=id`;
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url,
    headers: {
      "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
    },
  };

  try {
    const response = await axios.request(config);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      console.log("API Error Response:", error.response.data);
      return res.status(error.response.status || 500).json(error.response.data);
    } else {
      console.error("Unexpected Error:", error.message);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};
