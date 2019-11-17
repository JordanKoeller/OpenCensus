# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %% Change working directory from the workspace root to the ipynb file location. Turn this addition off with the DataScience.changeDirOnImportExport setting
# ms-python.python added
import os
try:
	os.chdir(os.path.join(os.getcwd(), '../../../tmp'))
	print(os.getcwd())
except:
	pass
# %% [markdown]
# # Processing the raw data.
# 
# This jupyter notebook uses Google's Tesseract open source project to convert a pdf containing many charts into a collection of CSV files.
# 
# ## Methodology
# 
# Attempts to use `tesseract` without any pre-Processing led to a lot of issues. To confront this I process the charts as follows:
# 
#   + Convert the pdf to a high-dpi png using Pillow.
#   + Analyze the pixels of the png. Search for vertical straight lines to identify columns.
#   + Chop the png into strips, where each strip is a column of data.
#   + Run the column through tesseract. Tesseract converts it to a column of text.
#   + Repeat for each strip, building a representation of the data in a format that can be exported to CSV. Note that these are still strings. `tesseract` is fairly accurate but often gets the commas and stray marks in the data miss-interperited.
#   + Lastly, I look at the CSV, look for mistakes, and correct them.

# %%
# Import block.
import pytesseract
import csv
from PIL import Image
import numpy as np
# %matplotlib notebook
from matplotlib import pyplot as plt


# %%
# Convert a specific page of the pdf to png.
import pdf2image
def getPngPage(index: int) -> Image:
    filePath = './colonial-1970-migration.pdf'
    return pdf2image.convert_from_path(
        filePath,
        output_file='./colonial_%d' % index,
        dpi=600,
        first_page=index,
        last_page=index,
        grayscale=True
    )[0]


# %%
# Algorithm for finding what's a good threshold of pixel values to identify column divisions in the graph.
def findThrehsold() -> None:
    chart1 = getPngPage(19)
    rawData = np.asarray(chart1)
    height, width = rawData.shape
    summed = [rawData[:,i].sum() for i in range(width)]
    plt.plot(summed)
# findThrehsold()
# Found a reasonable threshold of less than 800,000
threshold = 800000

def extractColumnsInds(data: np.ndarray) -> [[int]]:
    # First get all columns below threshold
    height, width = data.shape
    summedValues = np.array([data[:,i].sum() for i in range(width)])
    lineIndices = np.where(summedValues < threshold)[0]
    # Now I need to remove duplicates - perhaps there were two pixel columns that passed the threshold that are really one table column.
    ret = []
    colStart, colEnd = (0, 0)
    for index in range(len(lineIndices)-1):
        nextInd = index + 1
        if lineIndices[nextInd] > lineIndices[index] + 200:
            ret.append([lineIndices[index], lineIndices[nextInd]])
    return ret

def removeHeader(data: Image) -> Image:
    npData = np.asarray(data)
    height, width = npData.shape
    topThird = npData[:height // 3,:]
    sums = np.array([topThird[i,:].sum() for i in range(topThird.shape[0])])
    plt.plot(sums)
    lastLine = np.where(sums < 20000)[0].max()
    return Image.fromarray(npData[lastLine:,:])
# removeHeader(data)


# %%
tesseractConfig = """tessedit_char_whitelist 0123456789,-
tessedit_ocr_engine_mode 2
tessedit_pageseg_mode 4
tessedit_char_blacklist ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+=~`;:/?.><[{]}|
"""

def getCsv(pageNumber: int) -> None:
    totalImage = getPngPage(pageNumber)
    totalData = np.asarray(totalImage)
    colInds = extractColumnsInds(totalData)
    colImgs = [Image.fromarray(totalData[:,s+1:e]) for s, e in colInds]
    cols = []
    col = colImgs[0]
    noHead = removeHeader(col)
    noHead.show()
    return
    for col in colImgs:
        noHeader = removeHeader(col)
        textColumns = pytesseract.image_to_string(noHeader, config=tesseractConfig)
        cols.append(textColumns.split("\n"))
    data = np.array(cols)
    return data
getCsv(19)


# %%


