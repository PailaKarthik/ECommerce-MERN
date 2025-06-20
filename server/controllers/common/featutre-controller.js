const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const featuresImages = new Feature({
      image,
    });
    await featuresImages.save();

    res.status(201).json({
      success: true,
      data: featuresImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Internal Error",
    });
  }
};
const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(201).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Internal Error",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };
