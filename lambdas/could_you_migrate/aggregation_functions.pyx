# cython: profile=False, boundscheck=False, wraparound=False, embedsignature=False
# cython: language_level=3

cimport numpy as np
import numpy as np
from libc.math cimport floor

cdef int cmin(int a, int b, int c):
    if a <= b and a <= c: return a
    if b <= a and b <= c: return b
    if c <= a and c <= b: return c

cpdef object sevenPcntRuleWaitlist(np.ndarray[np.int32_t, ndim=2] applicants):
    cdef:
        int yearI, countryI, i, contribution, numCountries, numYears
        np.ndarray[np.int32_t, ndim=2] accepted, waitlist
        np.ndarray[np.int64_t, ndim=1] sortedCountryIndices
        int totalAllowedThisYear, remainingCountries, maxAmtInSingleCountry
        double percentageOfTotal
    waitlist = applicants.copy()
    accepted = np.ones_like(applicants) - 1
    numYears = waitlist.shape[0]
    numCountries = waitlist.shape[1]
    for yearI in range(0, numYears - 1):
        totalAllowedThisYear = 0
        percentageOfTotal = 0
        maxAmtInSingleCountry = 0
        sortedCountryIndices = np.argsort(waitlist[yearI])
        for countryI in range(0, numCountries):
            remainingCountries = numCountries - countryI
            # projectedTotal = cumTotal + adding * remainingCountries
            # (adding + amtInRemainingCountries) / projectedTotal <= 0.07
            #
            # 0.07*projectedTotal >= adding + amtInRemainingCountries
            # 0.07 * (cumTotal + adding * remainingCountries) >= adding + amtInRemainingCountries
            # 0.07 * cumTotal + adding * 0.07 * remainingCountries >= adding + amtInRemainingCountries
            # 0.07 * cumTotal + adding * (0.07 * remainingCountries - 1) >= amtInRemainingCountries
            # adding <= (amtInRemainingCountries - 0.07*cumTotal)/(0.07*remainingCountries - 1)
            contribution = cmin(waitlist[yearI,sortedCountryIndices[countryI]],
                                <int> floor((<double> maxAmtInSingleCountry - 0.07*totalAllowedThisYear)/(0.07*remainingCountries - 1.0)),
                                <int> floor((675000-totalAllowedThisYear)/<double> remainingCountries))
            if totalAllowedThisYear >= 675000:
                break
            if contribution == 0:
                # The current country cannot contribute any more people.
                # This ~may~ just be because two countries had the same number of immigrants
                # they let in that year. Thus we cannot break out of the year's loop but rather just skip forward to
                # the next country.
                continue
            maxAmtInSingleCountry = contribution + maxAmtInSingleCountry
            for i in range(countryI, numCountries):
                accepted[yearI, sortedCountryIndices[i]] = contribution + accepted[yearI, sortedCountryIndices[i]]
                totalAllowedThisYear = contribution + totalAllowedThisYear
            for i in range(numCountries):
                waitlist[yearI, i] = waitlist[yearI, i] - contribution
        for countryI in range(0, numCountries):
            if waitlist[yearI, countryI] > 0:
                waitlist[yearI+1, countryI] = waitlist[yearI+1, countryI] + waitlist[yearI, countryI]
    return (waitlist, accepted)

