const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context) => {
    let object = event["Records"][0]["s3"]["object"];
    let images;
    const bucket = event.Records[0].s3.bucket.name;
    const params = {
        Bucket: bucket,
        Key: 'images.json'
    }; 
    try {
        images = await s3.getObject(params).promise();
        images = JSON.parse(images.Body.toString('utf-8'))
        return images
    } catch (err) {
        if(err.message !== "The specified key does not exist."){
            console.log(err);
        } else {
            images = [];
        }
    }

        let meta = {
        name: object.key, 
        type: object.key.slice(-4), 
        size: object.size
        }
        
        console.log("add", meta);
        console.log("before add", images);
        images.push(meta)
        console.log("after add", images);
        
        var params2 = {
            Body: JSON.stringify(images),
            Bucket: bucket,
            Key: 'images.json',
            ContentType: 'application/json'
        };
        
        s3.putObject(params2, function(err, data){
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
};