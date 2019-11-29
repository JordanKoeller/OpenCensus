import numpy as np
from aggregation_functions import sevenPcntRuleWaitlist

class CensusTable:


    def __init__(self, parser):
        self.headers = next(parser)
        table = np.array([row for row in parser], dtype=float).astype(np.int32)
        self.years = table[:,0]
        self.table = table[:,1:]
        self.waitlist, self.accepted = sevenPcntRuleWaitlist(self.table)
        self._lookup = {h: ind - 1 for ind, h in enumerate(self.headers)}

    def columnOf(self, header):
        return self.table[:,self._lookup[header]]
    
    def waitlistColumnOf(self, header):
        return self.cumsumTable[:,self._lookup[header]]
