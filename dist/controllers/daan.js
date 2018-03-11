"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const Amazon = __importStar(require("@mcrowe/amazon-product-api"));
const keys = __importStar(require("../config/api_keys"));
const loadJsonFile = require("load-json-file");
const causesToCharityMapping = require("../../causes_data/cause_charity_mapping.json");
const categoryToCauseMapping = require("../../causes_data/category_cause_mapping.json");
exports.getProductInfo = (req, res) => {
    // res.send(JSON.stringify({ a: "Hello world" }));
    getProductInformationHelper(req.param("id")).then((productInfoData) => {
        // res.send(data.data);
        getRecommendationForCharity(productInfoData.data.category, res);
    });
};
const getProductInformationHelper = (productID) => {
    const result = Amazon.getProduct(keys.amazonKey, "ca", productID);
    return result;
};
const getRecommendationForCharity = (productCategory, res) => {
    // first obtain a mapping from product category to cause
    console.log("product category is", productCategory);
    if (categoryToCauseMapping[productCategory] != undefined) {
        const cause = categoryToCauseMapping[productCategory][0]; // pick first cause
        console.log(cause);
        const charityFileName = causesToCharityMapping[cause][0];
        // CharityInfo = Uphold_Human_Rights_Fund.name;
        loadJsonFile("causes_data/" + charityFileName).then((x) => {
            res.send(x);
        });
    }
    else
        loadJsonFile("causes_data/Uphold_Human_Rights_Fund.json").then((returnADefaultValue) => {
            res.send(returnADefaultValue);
        });
};
//# sourceMappingURL=daan.js.map