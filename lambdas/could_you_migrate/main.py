import csv

import boto3
import numpy as np

from .census_table import CensusTable

def aggregateData(path, fromFile=False):
    parser = None
    if fromFile:
        with open(path) as f:
            parser = csv.reader(f)
    else:
        raise NotImplementedError
    table = CensusTable(parser)



def getMigrationReport(year, countryOfOrigin):
    censusTable = aggregateData(path)