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
logger = logging.getLogger('Main')

S3_ERROR = {
    "isBase64Encoded": False,
    "statusCode": 500,
    "headers": {"Content-Type": "application/json"},
    "body": '{"Messsage": "Could not communicate with s3"}'
}

def main(event, context):
    context.log("====================BEGIN TRANSACTION========================\n")
    context.log("========================REQUEST==============================\n")
    context.log(event)
    context.log("\n")
    path = event['path']
    handlerLookup = {
        '/can-you-migrate': handleCanYouMigrate,
        '/get-country-headers': handleRequestHeaders,
        '/get-country-headers/hierarchy': handleRequestCountryGroupsHierarchy,
        '/migration-history': handleRequestHistoricalMigration,
    }
    resp = handlerLookup[path](event, context)
    context.log("========================RESPONSE=============================\n")
    context.log(resp)
    context.log("\n")
    context.log("======================END TRANSACTION========================\n")
    return resp

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
    BUCKET_NAME = "open-justice-resources" # os.environ['CENSUS_BUCKET']
    OBJECT_NAME = "aggregatedSheet.csv" # os.environ['CENSUS_OBJECT']
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
        country = requestInfo['country']
        year = requestInfo['year']
        expectedWaitRange = table.expectedWaitTimeRange(country, year)
        return _respond(200, {
            'waitMin': int(expectedWaitRange[0]),
            'waitMax': int(expectedWaitRange[0]),
            'applied': int(table.applied.get(country, year)),
            'accepted': int(table.accepted.get(country, year)),
            'waitlist': int(table.waitlist.get(country,year))
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
        body = {
            'headers': table.headers,
            'years': table.years.tolist(),
            'applications': table.applied.tolist(),
            'accepted': table.accepted.tolist(),
            'waitlist': table.waitlist.tolist(),
        }
        return _respond(200, body)
    return S3_ERROR

def handleRequestCountryGroupsHierarchy(event, context):
    groupings = {
        'North America & South America': {
            "Canada & Newfoundland": ["Canada & Newfoundland"],
            "Mexico": ["Mexico"],
            "West Indies": ["West Indies"],
            "Other America": ["Other America"]
        },
        'Asia': {
            "Southeast Asia": ["Asian Turkey"],
            "Central Asia": ["China", "India"],
            "East Asia": ["Japan", "Korea", "Philippines"],
            "Other Asia": ["Other Asia"]
        },
        'Europe': {
            "Western Europe": ["Great Britain", "Ireland", "Other NW Europe"],
            "Scandinavia": ["Scandinavia"],
            "Central Europe": ["Germany", "Italy", "Other Central Europe"],
            "Southern Europe": ["Italy", "Other Southern Europe"],
            "Eastern Europe": ["USSR & Baltic States", "Other Eastern Europe", "Poland"]
        },
        # 'Africa' {},
        # 'Australia': {},
    }
    return _respond(200, {'countryGroups': groupings})

if __name__== '__main__':
    import sys
    args = sys.argv
    os.environ.update({
        'CENSUS_BUCKET': 'open-justice-resources',
        'CENSUS_OBJECT': 'aggregatedSheet.csv' 
    })
    if 'test' in args:
        import unittest
        unittest.main(module='test.test_handler')
    else:
        mockReq = {
            "body": {'country': 'Ireland', 'year': 1920},
            "path": '/can-you-migrate'
        }
        resp = main(mockReq, '')
        context.log(resp)
