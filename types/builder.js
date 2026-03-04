/**
 * @typedef {Object} GlobalConfig
 * @property {string} backgroundColor - ex: "#ffffff"
 * @property {string} fontFamily - ex: "Arial, sans-serif"
 * @property {string} containerWidth - ex: "600px"
 */

/**
 * @typedef {Object} Component
 * @property {string} id
 * @property {"mj-text"|"mj-image"|"mj-button"|"mj-divider"} type
 * @property {Object} attributes
 * @property {string} [content] - HTML interno (mj-text e mj-button)
 */

/**
 * @typedef {Object} Column
 * @property {string} id
 * @property {Object} attributes
 * @property {Component[]} components
 */

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {1|2|3} columns
 * @property {Object} attributes
 * @property {Column[]} columnList
 */

/**
 * @typedef {Object} Template
 * @property {GlobalConfig} globalConfig
 * @property {Section[]} sections
 */
