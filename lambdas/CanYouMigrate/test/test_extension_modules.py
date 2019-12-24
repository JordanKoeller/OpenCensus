from unittest import TestCase

import numpy as np

from aggregation_functions import sevenPcntRuleWaitlist, computeExpectedAdmissionYear


class TestSevenPcntRuleWaitlist(TestCase):

    def confirmDidNotAdmitMoreThanApplied(self, inputData, waitlist, admitted):
        """
        A helper function that can be used to confirm the algorithm
        did not let in more applicants than those that applied.

        Similarly, this function runs tests to make sure there are no
        negative values
        """
        agged = np.cumsum(inputData, axis=0)
        admitAgged = np.cumsum(admitted, axis=0)
        self.assertTrue(np.all(admitted <= agged))
        self.assertTrue(np.all(admitted >= 0))
        self.assertTrue(np.all(waitlist >= 0))
        self.assertTrue(np.all(waitlist <= agged))
        self.assertTrue(np.all(waitlist+admitAgged == agged))

    def confirmObeysSevenPercentRuleAnd675KCap(self, inputData, waitlist, admitted):
        for inputRow, admitRow in zip(inputData, admitted):
            totalAdmitted = np.sum(admitRow)
            self.assertTrue(np.all(admitted <= 0.07*totalAdmitted))
            self.assertTrue(totalAdmitted <= 675000)

    def testLetsUpTo47KWhenFewerThan15Countries(self):
        testData = np.array([[int(675000*0.07) for r in range(10)] for k in range(15)], dtype=np.int64)
        waitlist, admitted = sevenPcntRuleWaitlist(testData)
        for elem in waitlist.flatten():
            self.assertEqual(0, elem)
        for elem in admitted.flatten():
            self.assertEqual(int(675000*0.07), elem)

    def testLetsUpTo5PercentWhen20Countries(self):
        testData = np.array([[int(675000*0.025) for r in range(20)] for k in range(15)], dtype=np.int64)
        waitlist, admitted = sevenPcntRuleWaitlist(testData)
        for elem in waitlist.flatten():
            self.assertEqual(0, elem)
        for elem in admitted.flatten():
            self.assertEqual(int(675000*0.025), elem)

    def testLimitsEntryTo5PercentWhenExcessApplicantsAccross20Countries(self):
        testData = np.array([[int(675000*0.1) for r in range(20)] for k in range(15)], dtype=np.int64)
        expectedWaitlist = np.array([[int(675000*0.05)*k for r in range(20)] for k in range(16)], dtype=np.int64)
        expectedWaitlist[:15,:] += np.int64(675000*0.05)
        waitlist, admitted = sevenPcntRuleWaitlist(testData, 1)
        for elem in admitted.flatten():
            self.assertEqual(int(675000*0.05), elem)
        for e, g in zip(waitlist.flatten(), expectedWaitlist.flatten()):
            self.assertEqual(e, g)

    def testDoesNotAllowMoreEntriesThanApplicants(self):
        testData = np.array([[(r+1)*10 for r in range(250)] for k in range(15)], dtype=np.int64)
        waitlist, admitted = sevenPcntRuleWaitlist(testData)
        self.confirmDidNotAdmitMoreThanApplied(testData, waitlist=waitlist, admitted=admitted)
        self.confirmObeysSevenPercentRuleAnd675KCap(testData, waitlist, admitted)

    def testDoesNotAllowMoreThan7PercentOfASingleCountry(self):
        testData = np.array([[(r+1)*10000 for r in range(25)] for k in range(15)], dtype=np.int64)
        waitlist, admitted = sevenPcntRuleWaitlist(testData)
        self.confirmDidNotAdmitMoreThanApplied(testData, waitlist=waitlist, admitted=admitted)
        self.confirmObeysSevenPercentRuleAnd675KCap(testData, waitlist, admitted)

    def testDoesNotFailOnCountryContributingZeroImmigrants(self):
        testData = np.array([[0, 0, 0, 0] + [(r+1)*10000 for r in range(25)] for k in range(15)], dtype=np.int64)
        waitlist, admitted = sevenPcntRuleWaitlist(testData)
        self.confirmDidNotAdmitMoreThanApplied(testData, waitlist=waitlist, admitted=admitted)
        self.confirmObeysSevenPercentRuleAnd675KCap(testData, waitlist, admitted)

    def testDoesNotCrashWhileComputingExpectedWaitimes(self):
        testData = np.array([[0, 0, 0, 0] + [(r+1)*10000 for r in range(25)] for k in range(25)], dtype=np.int64)
        waitlist, admitted = sevenPcntRuleWaitlist(testData)
        waitTimes = computeExpectedAdmissionYear(admitted, waitlist)
        self.assertTrue(True)

    def testIdentifiesNoWaitlistAsHavingWaitOfZeroToZeroYears(self):
        testData = np.array([[int(675000*0.05) for r in range(10)] for k in range(15)], dtype=np.int64)
        waitlist, admitted = sevenPcntRuleWaitlist(testData)
        waitTimes = computeExpectedAdmissionYear(admitted, waitlist)
        self.assertTrue(np.all(waitlist == 0))
        self.assertTrue(np.all(waitTimes[:,:,0] == 0))
        self.assertTrue(np.all(waitTimes[:,:,1] == 0))

    def testIdentifiesNoWaitlistAsHavingWaitOfZeroToZeroYears(self):
        testData = np.array([[int(675000*0.1) for r in range(15)] for k in range(15)], dtype=np.int64)
        waitlist, admitted = sevenPcntRuleWaitlist(testData)
        waitTimes = computeExpectedAdmissionYear(admitted, waitlist)
        self.confirmDidNotAdmitMoreThanApplied(testData, waitlist, admitted)
        self.confirmObeysSevenPercentRuleAnd675KCap(testData, waitlist, admitted)
        self.assertTrue(np.all(waitlist > 0))
        self.assertTrue(np.all(waitTimes[:,:,0] >= 0))
        self.assertTrue(np.all(waitTimes[:,:,1] >= 1))