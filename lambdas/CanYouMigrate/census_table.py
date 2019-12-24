import numpy as np
from aggregation_functions import sevenPcntRuleWaitlist, computeExpectedAdmissionYear

class CensusTable:
    """
    The `CensusTable` class encapsulates all the analysis functionality for analyzing a csv of immigration data
    and computing how many people are able to come to America per country per year and how many get put on a 
    waitlist to be allowed in.

    To construct a `CensusTable` instance, you pass in a CSVReader of the csv file to be parsed. The CensusTable
    constructor asumes that the table has rows pertain to number of immigrants per year and columns for each
    country of origin. We assume column headers are present as well as year labels. Years should be in descending
    order.
    """


    def __init__(self, parser):
        self.headers = next(parser)
        listTable = [
            [cell for ind, cell in enumerate(row) if 'Total' not in self.headers[ind]]
            for row in parser
        ][::-1]
        table = np.array(listTable, dtype=float).astype(np.int64)
        self.years = table[:,0]
        self.table = table[:,1:]
        self.waitlist, self.accepted = sevenPcntRuleWaitlist(self.table)
        self.expectedWaitTime = computeExpectedAdmissionYear(self.accepted, self.waitlist)
        self._countryLookup = {h: ind - 1 for ind, h in enumerate(self.headers)}
        self._yearLookup = {year: ind for ind, year in enumerate(self.years)}

    def columnOf(self, header):
        return self.table[:,self._lookup[header]]


    @property
    def sevenPcntRuleAdmission(self):
        return self.accepted / self.table

    def expectedWaitTimeRange(self, countryOfOrigin, year):
        return self.expectedWaitTime[self._yearLookup[year], self._countryLookup[countryOfOrigin]]
        

