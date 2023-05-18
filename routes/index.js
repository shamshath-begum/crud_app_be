var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { dbUrl } = require("../config/dbConfig");
const { UserModel } = require("../schema/userSchema.js");
const {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  roleAdmin,
  roleSalesRep,
} = require("../config/auth");
const secretKey = "lkhhfalshflk";
const jwt = require("jsonwebtoken");
mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

router.post("/register", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      let doc = new UserModel(req.body);
      await doc.save();
      res.status(201).send({
        message: "User Created successfully",
      });
    } else {
      res.status(400).send({ message: "User already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

router.get("/display-user", async (req, res) => {
  let search = req.query.search || "";
  let gender = req.query.gender || "";
  let status = req.query.status || "";
  let sort = req.query.sort || "";
  let page = req.query.page || 1;
  let Item_Per_Page = 4;

  console.log(req.query);
  let query = {
    fname: { $regex: search, $options: "i" },
  };
  if (gender !== "All") {
    query.gender = gender;
  }
  if (gender.toLowerCase() == "male") {
    query.gender = "male";
  }
  if (status !== "All") {
    query.status = status;
  }
  try {
    let skip = (page - 1) * Item_Per_Page;

    let count = await UserModel.countDocuments(query);
    console.log(count);

    let data = await UserModel.find(query)
      .sort({ datecreated: sort == "new" ? -1 : 1 })
      .limit(Item_Per_Page)
      .skip(skip);
    let pageCount = Math.ceil(count / Item_Per_Page);

    res.status(200).send({
      Pagination: { count, pageCount },
      users: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error ",
      error,
    });
  }
});

router.put("/status/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let data = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    console.log(data);
    res.status(201).send({
      message: "Status updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      message: "Internal Server error",
      error,
    });
  }
});

router.get("/profile/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    let data = await UserModel.find({ _id: req.params.id });
    res.status(200).send({
      user: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error ",
      error,
    });
  }
});

router.get("/edit/:id", async (req, res) => {
  let { id } = req.params;
  console.log({ id });
  try {
    let data = await UserModel.find({ _id: req.params.id });
    res.status(200).send({
      user: data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error ",
      error,
    });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let data = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    console.log(data);
    res.status(201).send({
      message: "Lead updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      message: "Internal Server error",
      error,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let data = await UserModel.findByIdAndDelete({ _id: id });
    console.log(data);
    res.status(200).send({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Internal Server error",
      error,
    });
  }
});

module.exports = router;
