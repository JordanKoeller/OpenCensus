# cython: profile=False, boundscheck=False, wraparound=False, embedsignature=False
# cython: language_level=3

cimport numpy as np
import numpy as np

cpdef object sevenPcntRuleWaitlist(np.ndarray[np.int32_t, ndim=2] applicants)