from distutils.core import setup, Extension

import numpy
import sys
import os


if __name__ =="__main__":
    EXT = None
    if "--no-cython" in sys.argv:
        EXT = ".c"
        sys.argv.remove('--no-cython')
    else:
        EXT = ".pyx"
    agg_funcs = Extension("aggregation_functions", sources = ["aggregation_functions" + EXT], language = "c")

    modules = [agg_funcs]

    if EXT == ".pyx":
        from Cython.Build import cythonize
        modules = cythonize(modules)
    setup(
        ext_modules = modules,
        include_dirs = [numpy.get_include()],
    )
