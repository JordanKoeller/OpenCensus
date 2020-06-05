import json
import hashlib

import boto3

import requests

from boto3.dynamodb.conditions import Key

def main(event, context):
  context.log("====================BEGIN TRANSACTION========================\n")
  context.log("========================REQUEST==============================\n")
  context.log(event)
  context.log("\n")
  path = event['path']
  handlerLookup = {
      '/videos': handleRequestPage,
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


def handleRequestPage(event, context):
  client = boto3.client('dynamodb')
  dynamoResponse = client.scan(
    TableName='PoliceVideosMemos',
    Select='ALL_ATTRIBUTES',
    Limit=100,
    FilterExpression='begins_with (id , :tweet)',
    ExpressionAttributeValues={
      ':tweet': {'S': 'tweet-'}
    }
  )['Items']
  return _respond(200,mapDynamoDbResponse( dynamoResponse))

def mapDynamoDbResponse(response):
  ret = []
  for r in response:
    value = r['value']['M']
    tempDict = {}
    for k in value:
      for _k, v in value[k].items():
        tempDict.update({k: v})
    ret.append(tempDict)
  return ret


def putInDynamoDb(body):
  """
  Entrypoint for processing what the twitter bot
  POSTs to the API Gateway.

  Expected Body:

  ```
  {
    TweetBody?: string, // Contents of the tweet, if available
    TweetLink?: string, // Link to original tweet, if available
    VideoLink: string,
    Location?: string | {lat: number, lng: number} // City name or coordinates, if available
    Timestamp?: string // dd-mm-yy timestamp (or some other format parseable by datetime), if available
  }
  ```
  """
  vidHash = uploadToS3(body['VideoLink'])
  dynDb = boto3.client('dynamodb')


def uploadToS3(url):
  """
  Downloads the video at the url, and uploads it to s3.
  
  Returns the sha256 checksum as the video's ID.
  """
  vid = requests.get(url)
  if vid.ok:
    s3 = boto3.client('s3')
    bucket = 'twitter-vids'
    checksum = hashlib.sha256()
    checksum.update(vid.content)
    sha = checksum.hexdigest()
    try:
      s3.put_object(Bucket=bucket, Body=vid.content, Key=sha)
    except:
      return None
    return sha
  return None
