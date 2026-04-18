const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config);

const createTable = (schema) => {
  return new Promise((resolve, reject) => {
    pool.query(schema, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const checkRecords = (tableName, where = "", values = []) => {
    const query = `SELECT * FROM ${tableName} ${where}`;
  return new Promise((resolve, reject) => {

    pool.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};
// CREATE
const insertRecord = (tableName, record) => {
    const query = `INSERT INTO ${tableName} SET ?`;
  return new Promise((resolve, reject) => {

    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
// READ
const returnRecords = (table, where = "", values = []) => {
    const query = `SELECT * FROM ${table} ${where}`;

    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, result) => {
            if(error){
                reject(error);
            }else{
                resolve(result.length ? result : null);
            }
        });
    });
};
// UPDATE
const updateRecord = (tableName, record, where = "", values = []) => {
    const query = `UPDATE ${tableName} SET ? ${where}`;
  return new Promise((resolve, reject) => {

    pool.query(query, [record, values], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
// DELETE
const deleteRecord = (tableName, where = "", values = []) => {
    const query = `DELETE FROM ${tableName} ${where}`;
  return new Promise((resolve, reject) => {

    pool.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
    createTable,
    checkRecords,
    returnRecords,
    insertRecord,
    updateRecord,
    deleteRecord,
};