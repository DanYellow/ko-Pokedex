'use strict';

/**
* @class : Helpers
* @classdesc : Contains every transversal methods of the project 
* It's better to call it without instantiate it
* 
**/

module.exports = {
/**
 * @function inRange
 * @description Indicate if the value is between range
 *
 * @param {Number} value : value to test
 * @param {Number} minValue : Min value allowed
 * @param {Number} maxValue : Max value allowed 
 * 
 * @return Boolean
*/
  inRange: function(value, minValue, maxValue) {
    return value >= minValue && value <= maxValue;
  }
};