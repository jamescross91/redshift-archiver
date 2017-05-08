## Redshift Automatic Archiver
A simple NodeJS process for automatically archiving data in tables to S3.

## How to run

1. Create a config.json file with your AWS credentials:
```
{
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": "eu-west-1"
}
```

2. Create a DynamoDB table called `cube-archive-configuration`, or change the name to something you prefer in `index.js`.  The table should have a primary key column called table name, and an additional column called timestamp_col.  Your table_name field should contain the fully qualified table name - e.g. schema.table_name.  The timestamp_col should contain the column name from your redshift table that contains the comparison timestamp data.
3. In `redshift-archiver` change the bucket-name to a bucket name you can access, update the IAM role to match the IAM role of your redhsift instance.  Note - this role should grant redshift the ability to read and write to your S3 bucket, as well as the host and database name for your redshift cluster
4. Build: `docker build -t redshift/archiver .`
4. Run: `docker run -it -e PGUSER=redshift_user_name -e PGPASSWORD=redshift_password redshift/archiver`
