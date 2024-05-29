const Details = require("../model/details.model");

exports.getDetails = async (req, res) => {
  try {
    const details = await Details.find();
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch details" });
  }
};

exports.postDetails = async (req, res) => {
  try {
    const details = await Details.create(req.body);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: "Failed to create details" });
  }
};

exports.deleteDetails = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const postdelete = await Details.findByIdAndDelete(id);
    if (!postdelete) {
      res.status(404).json({ error: "Details not found" });
    } else {
      res.json({ message: "Details successfully deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete details" });
  }
};

exports.editDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedDetail = await Details.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedDetail) {
      return res.status(404).json({ error: "Details not found" });
    }
    res.json(updatedDetail);
  } catch (error) {
    res.status(500).json({ error: "Failed to update details" });
  }
};
