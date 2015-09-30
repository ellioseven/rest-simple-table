"use strict";

/**
 * Characters.
 *
 * @type {String}
 */

var SPACE = " ";
var EQUAL = "="
var DASH = "-";
var LINE = "\n";

/**
 * Defaults.
 *
 * @type {Object}
 */

var defaults = {
  symbols: {
    headTop: EQUAL,
    headBottom: DASH,
    bodyBottom: EQUAL
  }
}

/**
 * Merge settings with defaults.
 *
 * @param options
 * @returns {Object}
 */

var extend = function(options) {
  var settings = {};
  for(var option in defaults) {
    settings[option] = options[option] || defaults[option];
  }
  return settings;
}

/**
 * Constructor.
 *
 * @param table {{head: string[], body: *[]}}
 * @param options {Object}
 * @constructor
 */

var RST = function(table, options) {
  // Create settings from options and defaults.
  this.settings = extend(options || {});
  // Setters.
  this.head = table.head;
  this.body = table.body;
  this.columnCount = this.head.length || 0;
  this.cellWidth = this.calculateCellWidth();
};

/**
 * Return flattened array of cells in head and body.
 *
 * @param cells {Array} Array of cells - Used for recursion.
 * @param rows {Array} Array of rows - Used for recursion.
 * @returns {Array}
 */

RST.prototype.getAllCells = function(cells, rows) {
  var mod = this;
  var cells = cells || [];
  // Default table to table head and body.
  var rows = rows || mod.head.concat(mod.body);
  // Loop through each row.
  for (var i in rows) {
    if (Array.isArray(rows[i])) {
      // Flatten row.
      mod.getAllCells(cells, rows[i]);
    } else {
      // Append cell.
      cells.push(rows[i])
    }
  }
  return cells;
}

/**
 * Return the maximum character count in cells.
 *
 * @param length {Int} Character length - Used for recursion.
 * @param cells {Array} Array of cells - Used for recursion.
 * @returns {number}
 */

RST.prototype.calculateCellWidth = function(length, cells) {
  var mod = this;
  var length = length || 0;
  var cells = cells || mod.getAllCells();
  // Loop through all cells.
  for (var i in cells) {
    if (Array.isArray(cells[i])) {
      // Recursively flatten cells.
      length = mod.calculateCellWidth(length, cells[i]);
    } else {
      // Set length if cell length is greater.
      if (cells[i].length > length) {
        length = cells[i].length;
      }
    }
  }
  return length;
}

/**
 * Returns nth amount of padding.
 *
 * @param nth {Int} Amount of padding to return.
 * @param symbol {String} The symbol/character to pad with.
 * @returns {String}
 */

RST.prototype.pad = function(nth, symbol) {
  var symbol = symbol || SPACE;
  return Array(nth + 1).join(symbol);
}

/**
 * Returns a padded cell.
 *
 * @param cell {String} The cells content.
 * @returns {String}
 */

RST.prototype.padCell = function(cell) {
  var mod = this;
  var length = cell.length;
  // Calculate the difference between cell and maximum cell length.
  var diff = mod.cellWidth - length;
  if (diff > 0) {
    // Pad column if there is a difference.
    cell += mod.pad(diff);
  }
  return cell;
}

/**
 * Returns a flattened array of cells from rows.
 *
 * @param rows {Array} Rows of cells.
 * @param cells {Array} Existing columns - Used for recursion.
 * @returns {Array}
 */

RST.prototype.buildCells = function(rows, cells) {
  var mod = this;
  var cells = cells || [];
  // Loop through rows.
  for (var i = 0; i < rows.length; i++) {
    // Recursively flatten rows.
    if (Array.isArray(rows[i])) {
      mod.buildCells(rows[i], cells);
    } else {
      // Append cell.
      cells.push(rows[i]);
    }
  }
  return cells;
}

/**
 * Returns formatted cells.
 *
 * @param rows {Array} Cells to draw (return).
 * @returns {String}
 */

RST.prototype.drawCells = function(rows) {
  var mod = this;
  var rowsString = "";
  // Build a flattened array of columns of all rows.
  var cells = mod.buildCells(rows);
  // Loop through all columns.
  for (var i = 0; i < cells.length; i++) {
    // Pad out column.
    rowsString += mod.padCell(cells[i]);
    // Output a new line or a column separator.
    if ((i + 1) % mod.columnCount === 0) {
      rowsString += LINE;
    } else {
      rowsString += SPACE;
    }
  }
  return rowsString;
}

/**
 * Returns formatted horizontal rule.
 *
 * @param symbol {String} The horizontal rule symbol/character.
 * @param newLine {boolean} If rule should append a new line.
 * @returns {String}
 */

RST.prototype.drawRule = function(symbol, newLine) {
  var mod = this;
  var ruleString = "";
  var newLine = newLine || true;
  // Loop times the amount of columns.
  for (var column = 0; column < mod.columnCount; column++) {
    // Output the rule separator.
    if (column != 0) {
      ruleString += SPACE;
    }
    // Output the symbol x the maximum column width.
    for (var i = 0; i < mod.cellWidth; i++) {
      ruleString += symbol;
    }
  }
  if (newLine) {
    // Append new line after rule.
    ruleString += LINE;
  }
  return ruleString;
}

/**
 * Draws the table.
 *
 * @returns {String}
 */

RST.prototype.draw = function() {
  var mod = this;
  var output = "";
  output += mod.drawRule(mod.settings.symbols.headTop);
  output += mod.drawCells(mod.head);
  output += mod.drawRule(mod.settings.symbols.headBottom);
  output += mod.drawCells(mod.body);
  output += mod.drawRule(mod.settings.symbols.bodyBottom, false);
  return output;
}

/**
 * Export the module.
 *
 * @type {Function}
 */

module.exports = RST;