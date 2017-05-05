var pg = require('pg');

var config = {
    user: 'croud_kevin',
    database: '', //env var: PGDATABASE
    password: '', //env var: PGPASSWORD
    host: '', // Server hosting the postgres database
    port: 5439, //env var: PGPORT
    max: 1, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

exports.archive = function(table_name, tstamp_col, date_threshold) {
    var client = new pg.Client(config);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }

        var sql = `unload \
        ('select * from ${table_name} where date_cmp_timestamp(''${date_threshold}'', ${tstamp_col}) = 1') \
        to 's3://regus-cube-archive/${table_name}/${date_threshold}' \
        iam_role 'arn:aws:iam::114196566689:role/redshift-s3-full'`;

        console.log("Running " + sql);

        client.query(sql, function (err, result) {
            if (err) {
                console.error('error running query', err);
            }
            console.info("redshift load: no errors, seem to be successful, will try to dump!");
            delete_from_redshift(table_name, tstamp_col, date_threshold)
            client.end();
        });
    })
}

delete_from_redshift = function(table_name, tstamp_col, date_threshold) {
    var client = new pg.Client(config);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }

        var sql = `delete from ${table_name} where date_cmp_timestamp('${date_threshold}', ${tstamp_col}) = 1;`;

        console.log("Running " + sql);

        client.query(sql, function (err, result) {
            if (err) {
                console.error('error running query', err);
            }
            console.info("redshift delete: no errors, seem to be successful!");
            client.end();
        });
    })
}
