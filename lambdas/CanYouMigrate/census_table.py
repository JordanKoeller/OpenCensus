import numpy as np
from aggregation_functions import sevenPcntRuleWaitlist, computeExpectedAdmissionYear

class Table:

    def __init__(self, data, rowLookup, columnLookup):
        self._data = data
        self._rowLookup = rowLookup
        self._columnLookup = columnLookup
    
    def columnOf(self, header):
        return self._data[:,self._columnLookup[header]]

    def rowOf(self, header):
        return self._data[:,self._rowLookup[header]]

    def tolist(self):
        return self._data.tolist()

    @property
    def total(self):
        return np.sum(self._data, axis=1)

    def __getitem__(self, *args, **kwargs):
        return self._data.__getitem__(*args, **kwargs)

    def __str__(self, *args, **kwargs):
        return str(self._data.tolist())

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
        headers = [s for s in next(parser)]
        listTable = [
            [cell for ind, cell in enumerate(row) if 'Total' not in headers[ind]]
            for row in parser
        ][::-1]
        self.headers = [s for s in headers  if 'Total' not in s and 'Year' not in s]
        table = np.array(listTable, dtype=float).astype(int)
        self.years = table[:,0]
        self._table = table[:,1:]
        self._waitlist, self._accepted = sevenPcntRuleWaitlist(self._table)
        self._expectedWaitTime = computeExpectedAdmissionYear(self._accepted, self._waitlist)
        self._countryLookup = {h: ind - 1 for ind, h in enumerate(self.headers)}
        self._yearLookup = {year: ind for ind, year in enumerate(self.years)}

    def columnOf(self, header):
        return self._table[:,self._lookup[header]]

    def expectedWaitTimeRange(self, countryOfOrigin, year):
        return self._expectedWaitTime[self._yearLookup[year], self._countryLookup[countryOfOrigin]]

    @property
    def applied(self):
        return Table(self._table, self._yearLookup, self._countryLookup)

    @property
    def waitlist(self):
        return Table(self._waitlist, self._yearLookup, self._countryLookup)

    @property
    def accepted(self):
        return Table(self._accepted, self._yearLookup, self._countryLookup)

    @property
    def sevenPcntRuleAdmission(self):
        return self._accepted / self._table
