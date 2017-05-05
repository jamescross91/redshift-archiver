var AWS = require('aws-sdk');
var redshift = require("./redshift-archiver")
var dateFormat = require('dateformat');

AWS.config.loadFromPath('./config.json');
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "cube-archive-configuration";
var params = {
    TableName: table,
    ProjectionExpression: "table_name, timestamp_col"
};

console.log("Cuttoff date is " + get_cuttoff_date())
console.log("Scanning archive configuration table");

docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(table) {
            console.log("Processing" + table.table_name + ": " + table.timestamp_col);
            redshift.archive(table.table_name, table.timestamp_col, get_cuttoff_date())

        });
    }
}

function get_cuttoff_date() {
    var curr_date = new Date();
    var new_date = new Date(curr_date)

    new_date.setFullYear(curr_date.getFullYear() -2)

    return dateFormat(new_date, "yyyy-mm-dd");
}