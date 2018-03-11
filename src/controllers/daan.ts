"use strict";

import async from "async";
import request from "request";
import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import * as Amazon from "@mcrowe/amazon-product-api";

import * as keys from "../config/api_keys";

const loadJsonFile = require("load-json-file");

const causesToCharityMapping = require("../../causes_data/cause_charity_mapping.json");
const categoryToCauseMapping = require("../../causes_data/category_cause_mapping.json");

export let getProductInfo = (req: Request, res: Response) => {
    // res.send(JSON.stringify({ a: "Hello world" }));
    getProductInformationHelper(req.param("id")).then((productInfoData: any) => {
      // res.send(data.data);
      getRecommendationForCharity(productInfoData.data.category, res);
    });
  };

const getProductInformationHelper = (productID: string): any => {
    const result = Amazon.getProduct(keys.amazonKey, "ca", productID);
    return result;
};

const getRecommendationForCharity = (productCategory: string, res: Response) => {
  // first obtain a mapping from product category to cause
  console.log("product category is", productCategory);
  if (categoryToCauseMapping[productCategory] != undefined) {
  const cause = categoryToCauseMapping[productCategory][0]; // pick first cause
  console.log(cause);
  const charityFileName = causesToCharityMapping[cause][0];

  // CharityInfo = Uphold_Human_Rights_Fund.name;
  loadJsonFile("causes_data/" + charityFileName).then((x: any) => {
    res.send(x);
    });
  }
  else loadJsonFile("causes_data/Uphold_Human_Rights_Fund.json").then((returnADefaultValue: any) => {
    res.send(returnADefaultValue);
    });
};