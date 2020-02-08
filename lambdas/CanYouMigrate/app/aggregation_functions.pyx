# cython: profile=False, boundscheck=False, wraparound=False, embedsignature=False
# cython: language_level=3

cimport numpy as np
import numpy as np
from libc.math cimport floor

cdef long cmin3(long a, long b, long c):
    if a <= b and a <= c: return a
    if b <= a and b <= c: return b
    if c <= a and c <= b: return c

cdef long cmin2(long a, long b):
    if a <= b: return a
    else: return b

cpdef object sevenPcntRuleWaitlist(np.ndarray[np.int64_t, ndim=2] applicants, int flag=0):
    cdef:
        long yearI, countryI, i, contribution, numCountries, numYears
        np.ndarray[np.int64_t, ndim=2] accepted, waitlist
        np.ndarray[np.int64_t, ndim=1] sortedCountryIndices
        long totalAllowedThisYear, C_i, d_I, t_p
        double percentageOfTotal
        long totalYearApplicants, firstPopulousCountry, numContributingCountries
    waitlist = applicants.copy()
    accepted = applicants.copy() * 0
    numYears = applicants.shape[0]
    numCountries = applicants.shape[1]
    for yearI in range(0, numYears):
        totalAllowedThisYear = 0
        percentageOfTotal = 0
        sortedCountryIndices = np.argsort(waitlist[yearI])
        totalYearApplicants = 0
        d_I = numCountries
        for i in range(0, numCountries):
            if waitlist[yearI, sortedCountryIndices[i]] > 0:
                firstPopulousCountry = i
                break
        numContributingCountries = numCountries - firstPopulousCountry
        for countryI in range(firstPopulousCountry, numCountries):
            d_I = numCountries - countryI
            if numContributingCountries > 14:
                if totalAllowedThisYear > 0 and d_I < 15:
                    # pcnt = contrib / (prevCols + contrib*remainingCols)
                    # pcnt * prevCols + pcnt * contrib*remainCols = contrib
                    # pcnt * prevcols = contrib - pcnt*contrib*remaincols
                    # contrib = pcnt * prevcols/(1 - pcnt*remainCols)
                    contribution = cmin3(
                        waitlist[yearI, sortedCountryIndices[countryI]],
                        <long> ((0.07*totalAllowedThisYear)/(1-0.07*d_I)),
                        <long> ((675000 - totalAllowedThisYear)/d_I))
                else:
                    contribution = cmin2(
                        waitlist[yearI, sortedCountryIndices[countryI]],
                        <long> ((675000 - totalAllowedThisYear)/d_I))  
            else:
                contribution = cmin2(waitlist[yearI, sortedCountryIndices[countryI]], <long> (675000/numContributingCountries)) # .07 * 675k
            totalAllowedThisYear += contribution
            waitlist[yearI, sortedCountryIndices[countryI]] = waitlist[yearI, sortedCountryIndices[countryI]] - contribution
            accepted[yearI, sortedCountryIndices[countryI]] = contribution
        if yearI + 1 != numYears:
            for countryI in range(0, numCountries):
                if waitlist[yearI, countryI] < 0:
                    print("And another big ol error")
                waitlist[yearI+1, countryI] = waitlist[yearI+1, countryI] + waitlist[yearI, countryI]
    return (waitlist, accepted)

cpdef object computeExpectedAdmissionYear(np.ndarray[np.int64_t, ndim=2] accepted, np.ndarray[np.int64_t, ndim=2] waitlist, int flag=0):
    """
    Given the number of accepted and waitlisted individuals per year per country, this method computes the expected number of years on the waitlist
    a person applying to a specific country and specific year should expect to wait

    As such, it returns a 3D array of dimensions [yearIndex, countryIndex]. Note that the time given on the waitlist is
    a maximum. Say you have to wait N years, then in actuality, we should report an expected wait of [N-1 .. N] years.
    """

    # cdef:
    #     long numYears, numCountries, countryI, yearI
    #     np.ndarray[int64_t, ndim=3] ret
    cdef long numYears = accepted.shape[0]
    cdef long numCountries = accepted.shape[1]
    cdef long yearI = 0
    cdef long countryI = 0
    cdef long i = 0
    cdef long accumulator = 0
    cdef long initalWaitlist = 0
    cdef np.ndarray[np.int64_t, ndim=3] ret = np.ndarray((numYears, numCountries, 2), dtype=np.int64) * 0 - 1
    # min wait time is how long it takes to clear out existing waitlist.
    # max wait time is how long it takes to clear out all the applicants in your year.
    # simplest approach is to while loop forward.
    for yearI in range(0, numYears):
        for countryI in range(0, numCountries):
            accumulator = 0
            initalWaitlist = 0
            if yearI > 0:
                initalWaitlist = waitlist[yearI - 1, countryI]
            i = yearI
            while ret[yearI, countryI, 1] == -1:
                if i >= numYears:
                    accumulator = accumulator + accepted[numYears - 1, countryI]
                else:
                    accumulator = accumulator + accepted[i, countryI]
                if accumulator >= initalWaitlist and ret[yearI, countryI, 0] == -1:
                    ret[yearI, countryI, 0] = i - yearI
                if accumulator >= waitlist[yearI, countryI] + accepted[yearI, countryI] and ret[yearI, countryI, 0] != -1:
                    ret[yearI, countryI, 1] = i - yearI
                i += 1 
    return ret
            
