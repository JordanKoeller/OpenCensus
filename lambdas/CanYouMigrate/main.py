try:
    import unzip_requirements
except ImportError:
    pass

import json
import os
import csv
import logging

import numpy as np
import boto3
from botocore.exceptions import ClientError

from census_table import CensusTable

# Set up logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(levelname)s: %(asctime)s: %(message)s')

S3_ERROR = {
    "isBase64Encoded": False,
    "statusCode": 500,
    "headers": {"Content-Type": "application/json"},
    "body": '{"Messsage": "Could not communicate with s3"}'
}

def main(event, context):
    logging.info(event)
    path = event['path']
    handlerLookup = {
        '/can-you-migrate': handleCanYouMigrate,
        '/get-country-headers': handleRequestHeaders,
        '/migration-history': handleRequestHistoricalMigration,
    }
    return handlerLookup[path](event, context)

def _respond(code, body):
    return {
    "isBase64Encoded": False,
    "statusCode": code,
    "headers": {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
    },
    "body": json.dumps(body)
}

def _getTable():
    BUCKET_NAME = os.environ['CENSUS_BUCKET']
    OBJECT_NAME = os.environ['CENSUS_OBJECT']
    s3 = boto3.client('s3')
    sheet = None
    try:
        response = s3.get_object(Bucket=BUCKET_NAME, Key=OBJECT_NAME)
        sheet = response['Body'].iter_lines()
    except ClientError as e:
        logging.error(e)
        return None
    stringParser = map(lambda e: str(e, 'utf-8'), sheet)
    parser = csv.reader(stringParser)
    return CensusTable(parser)

def handleCanYouMigrate(event, context):
    table = _getTable()
    if table:
        requestInfo = json.loads(event['body'])
        expectedWaitRange = table.expectedWaitTimeRange(requestInfo['country'], requestInfo['year'])
        return _respond(200, {
            'waitMin': int(expectedWaitRange[0]),
            'waitMax': int(expectedWaitRange[0])
        })
    return S3_ERROR

def handleRequestHeaders(event, context):
    table = _getTable()
    if table:
        headers = table.headers
        return _respond(200, {'countries': headers})
    return S3_ERROR

def handleRequestHistoricalMigration(event, context):
    table = _getTable()
    if table:
        requestInfo = json.loads(event['body'])
        country = requestInfo['country']
        applications = list(table.applied.columnOf(country))
        projectedAcceptance = list(table.accepted.columnOf(country))
        body = {
            'applications': applications,
            'accepted': projectedAcceptance,
            'totalApplied': list(table.applied.total),
            'totalAccepted': list(table.accepted.total)
        }
        return _respond(200, body)
    return S3_ERROR

if __name__== '__main__':
    import sys
    args = sys.argv
    if 'test' in args:
        import unittest
        unittest.main(module='test.test_handler')
    else:
        mockReq = {'country': 'Ireland', 'year': 1920}
        resp = main(mockReq, '')
        logging.debug(resp)
