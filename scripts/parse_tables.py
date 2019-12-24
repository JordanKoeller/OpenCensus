
import csv
import os
import json

import numpy as np
from matplotlib import pyplot as plt
from PIL import Image


chartDirs = ['chart19', 'chart20', 'chart21', 'chart22', 'chart23']


import pdf2image
def getPngPage(fname) -> Image:
    tmp = pdf2image.convert_from_path(
        fname,
        dpi=600,
        grayscale=True
    )[0]
    tmpData = np.asarray(tmp)
    return Image.fromarray((tmpData > 128).astype(np.uint8)*255)


class BlockTable:

    class Block:
        # Page coordinates are based on the top left corner of the page. Increasing value right and down.
        def __init__(self, text, confidence, boundingBox, padding=None):
            self.text = text
            self.confidence = confidence
            self.boundingBox = boundingBox
            self.padding = padding or [1.0, 1.0]

        @property
        def cx(self):
            return (2 * self.boundingBox['Left'] + self.boundingBox['Width']) / 2

        @property
        def cy(self):
            return (2 * self.boundingBox['Top'] + self.boundingBox['Height']) / 2

        @property
        def width(self):
            return self.boundingBox['Width']

        @property
        def height(self):
            return self.boundingBox['Height']

        @property
        def left(self):
            return self.cx - (self.width * self.padding[0]) / 2

        @property
        def right(self):
            return self.cx + (self.width * self.padding[0]) / 2

        @property
        def top(self):
            return self.cy - (self.height * self.padding[1]) / 2

        @property
        def bottom(self):
            return self.cy + (self.height * self.padding[1]) / 2

        def overlapsColumns(self, other):
            return (self.left < other.left and self.right > other.right) or \
                (other.left < self.left and other.right > self.right) or \
                (self.left < other.left and self.right > other.left) or \
                (self.left < other.right and self.right > other.right)
        
        @property
        def asNumber(self):
            if self.text == '(10)':
                return -1
            retStr = ""
            for c in self.text:
                if c in '0123456789':
                    retStr = retStr + c
            if len(retStr):
                return int(retStr)
            return -1

        def inspect(self, img):
            x, y = img.size
            box = ((self.left-0.02)*x, (self.top - 0.01)*y, (self.right+0.02)*x, (self.bottom + 0.01)*y)
            cut = img.crop(box)
            cut.show()
            resp = input("Please enter the number shown \n(%s) > " % self.text)
            if resp:
                self.text = resp
                print("Reset text to %s" % self.text)


        def __repr__(self, *args, **kwargs):
            return self.text

    def __init__(self, headers, js, sourceImage):
        self.headers = headers
        self.img = sourceImage
        blocks = filter(lambda blk: blk['BlockType'] == 'WORD', js['Blocks'])
        blocks = list(map(lambda b: BlockTable.Block(b['Text'],
                                                          b['Confidence'],
                                                          b['Geometry']['BoundingBox'],
                                                          [1, 1]), blocks))
        self.blockHeaders = {}
        for block in blocks:
            if list(map(lambda b: b.text, self.blockHeaders.keys())) == self.headers:
                break
            if block.text in headers and block.cy < 0.25:
                block.padding = [3,1]
                self.blockHeaders.update({block: []})
        for block in blocks:
            for k in self.blockHeaders.keys():
                if k.cy < block.cy and block.overlapsColumns(k):
                    self.blockHeaders[k].append(block)
                    break
        for header, column in self.blockHeaders.items():
            column.sort(key=lambda e: e.cy)
    
    @property
    def numpyArray(self):
        columns = list(map(lambda e: [e[0]] + e[1], self.blockHeaders.items()))
        columns.sort(key=lambda lst: lst[0].cx)
        numRows = max(map(lambda col: len(col) - 1, columns))
        ret = np.ndarray((numRows, len(columns)), dtype=np.int32) * 0 - 1
        for i, col in enumerate(columns):
            for j, cell in enumerate(col):
                if j > 0:
                    ret[j-1,i] = cell.asNumber
        return ret.astype(np.int32)

    def inspectMistakes(self, threshold):
        """
        Given a confidence threshold, visually inspect and correct any boxes
        with a confidence interval lower than the threshold.
        """
        for k, v in self.blockHeaders.items():
            for i, block in enumerate(v):
                if len(block.text) >= 5 and block.text[-4] == '1' and \
                    i > 0 and i < len(v) - 1 and \
                    (block.asNumber / v[i - 1].asNumber > 5 or block.asNumber / v[i + 1].asNumber > 5):
                    print("Auto-fixing %s to %s" % (block.text, block.text[:-4] + block.text[-3:]))
                    block.text = block.text[:-4] + block.text[-3:]
                    break
                if block.confidence < threshold or (k.text != 'Year' and len(block.text) >= 4 and block.text[-4] == '1'):
                    block.inspect(self.img)
                



def getTable(js, colHeaders, tableImg):
    table = BlockTable(js, colHeaders, tableImg)
    threshold = 80
    table.inspectMistakes(threshold)
    return table.numpyArray

def titleIds(id):
    lookup = {
        19: {
            'ids':[str(i) for i in range(89, 102)],
            'headers': ['All', 'Total Europe', 'Great Britain', 'Ireland', 'Scandianvia', 'Other NW Europe', 'Germany', 'Poland', 'Other Central Europe', 'USSR & Baltic States', 'Other Eastern Europe', 'Italy', 'Other Southern Europe']
        },
        20: {
            'ids':[str(i) for i in range(89, 102)],
            'headers': ['All', 'Total Europe', 'Great Britain', 'Ireland', 'Scandianvia', 'Other NW Europe', 'Germany', 'Poland', 'Other Central Europe', 'USSR & Baltic States', 'Other Eastern Europe', 'Italy', 'Other Southern Europe']
        },
        21: {
            'ids': [str(i) for i in range(102, 115)],
            'headers': ['Total Asia', 'Asian Turkey', 'China', 'India', 'Japan', 'Korea', 'Philippines', 'Other Asia', 'Total America', 'Canada and Newfoundland', 'Mexico', 'West Indies', 'Other America']
        },
        22: {
            'ids': [str(i) for i in range(102, 115)],
            'headers': ['Total Asia', 'Asian Turkey', 'China', 'India', 'Japan', 'Korea', 'Philippines', 'Other Asia', 'Total America', 'Canada and Newfoundland', 'Mexico', 'West Indies', 'Other America']
        },
        23: { # I will probably need to do this one essentially by hand. The data is really poor and its format is a bit different.
            'ids': [str(i) for i in range(115, 120)] + [i for i in range(115, 120)],
            'headers': ['Africa Total', 'Total Australasia', 'Australia and New Zealand', 'Other Pacific Islands', 'All Other Countries', 'Africa Total', 'Total Australasia', 'Australia and New Zealand', 'Other Pacific Islands', 'All Other Countries']
        }
    }
    return lookup[id]['ids']


if __name__ == '__main__':
    resourceDir = '../resources/colonial-1970-migration'
    for i in range(22,23, 1):
        srcName = '%s/chart%d/apiResponse.json' % (resourceDir, i)
        imgName = '%s/chart%d/chart%d.pdf' % (resourceDir, i, i)
        destName = '%s/chart%d/table%d.csv' % (resourceDir, i, i)
        print("%s: %s: %s" % (srcName, imgName, destName))
        table = getTable(
            ['Year', *titleIds(i)],
            json.load(open(srcName)),
            getPngPage(imgName))
        np.savetxt(destName, table, delimiter=',')
    print("Continuing to table %d" % (i+1))



    

