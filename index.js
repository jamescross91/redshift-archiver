var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "cube-archive-configuration";

var params = {
    TableName: table,
    ProjectionExpression: "table_name, timestamp_col"
};

console.log("Scanning archive configuration table");

docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(table) {
            console.log(table.table_name + ": " + table.timestamp_col);
        });
    }
}