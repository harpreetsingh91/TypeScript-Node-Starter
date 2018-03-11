"use strict";

import async from "async";
import request from "request";
import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { ProductInfo } from "../classes/productInfo";
import * as Amazon from "@mcrowe/amazon-product-api";

import * as keys from "../config/api_keys";

const loadJsonFile = require("load-json-file");

const causesToCharityMapping = require("../../causes_data/cause_charity_mapping.json");
const categoryToCauseMapping = require("../../causes_data/category_cause_mapping.json");
const Uphold_Human_Rights_Fund = require("../../causes_data/Uphold_Human_Rights_Fund.json");

const amazonKey = {
  accessKeyId: process.env.awsAccessKey,
  secretAccessKey: process.env.awsSecret,
  associateTag: "harpreetvic-20",
  locale: "webservices.amazon.ca"
};

export let getProductInfo = (req: Request, res: Response) => {
    // res.send(JSON.stringify({ a: "Hello world" }));
    getProductInformationHelper(req.param("id")).then((productInfoData: any) => {
      // res.send(data.data);
      res.send(getRecommendationForCharity(productInfoData.data.category));
    });
  };

const getProductInformationHelper = (productID: string): any => {
    // const result = Amazon.getProduct(keys.amazonKey, "ca", productID);
    const result = Amazon.getProduct(amazonKey, "ca", productID); // for Heroku
    return result;
};

const getRecommendationForCharity = (productCategory: string) => {
  // first obtain a mapping from product category to cause
  // let CharityInfo;
  // const cause = categoryToCauseMapping[productCategory][0]; // pick first cause
  // console.log(cause);
  // const charityFileName = causesToCharityMapping[cause][0];

  // CharityInfo = Uphold_Human_Rights_Fund.name;


  return Uphold_Human_Rights_Fund;
};