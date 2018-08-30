'use strict';

const path = require('path');
const os = require('os');

const packageJson = require('../../package');

const storagePath = path.join(os.homedir(), '.bookjournal');


module.exports = {
    app: {
        name: 'Book Journal',
        version: packageJson.version,
        storagePath
    },
    database: {
        path: storagePath,
        fileName: 'bookjournal.sqlite'
    },
    bookcovers: {
        path: path.join(storagePath, 'bookcovers'),
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg']
    },
    bookInfo: {
        amazon: {
            url: 'http://webservices.amazon.com/onca/xml?Service=AWSECommerceService&AWSAccessKeyId=AKIAI5NHN2ZXOQQRDO4Q&AssociateTag=[Associate ID]&Operation=ItemLookup&ItemId=${isbn}&Timestamp=${timeStamp}&Signature=[Request Signature]'
        }
    }
};


// https://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html
// http://webservices.amazon.com/onca/xml?
// Service=AWSECommerceService&
// AWSAccessKeyId=[AWS Access Key ID]&
// AssociateTag=[Associate ID]&
// Operation=ItemLookup&
// ItemId=0316067938&
// ResponseGroup=Reviews&
// TruncateReviewsAt="256"&
// IncludeReviewsSummary="False"&
// Version=2013-08-01
// &Timestamp=[YYYY-MM-DDThh:mm:ssZ]
// &Signature=[Request Signature]
