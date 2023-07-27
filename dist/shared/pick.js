"use strict";
// this function will take something through req.query and will return a object based on the scenario.
// this function will take an object and an array! In this array the keys will be placed. using a loop we will find out the value of those particular key and then pair up the key value object. then return the final object.
Object.defineProperty(exports, "__esModule", { value: true });
/*
keys as paginationFields
=============================
{
  page:
  limit:
  sortBy:
  sortOrder:
}
*/
const pick = (obj, keys) => {
    const finalObj = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            //here hasOwnProperty takes 2 parameter. 1st one is the object and 2nd one is the keys array!
            //if the key is really exists in the object then we will do our task.(append the value into the finalObj object)
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
};
exports.default = pick;
