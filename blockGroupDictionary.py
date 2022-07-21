import csv
import json
import pprint
#import numpy as np

# import pandas as pd
#
#
# data = pd.io.stata.read_stata('CPS_harmonized_variable_longitudinally_matched_age16plus.dta')
# data.to_csv('my_stata_file.csv')
#

#quarterly files are in same single file, each row is 1 county for 1 quarter

#get state and district, 
#flip column

stateToNumber = {'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15', 'FL': '12', 'WY': '56', 'NH': '33', 'NJ': '34', 'NM': '35', 'TX': '48', 'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 'TN': '47', 'NY': '36', 'PA': '42', 'CA': '06', 'NV': '32', 'VA': '51', 'GU': '66', 'CO': '08', 'VI': '78', 'AK': '02', 'AL': '01', 'AS': '60', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13', 'IN': '18', 'IA': '19', 'OK': '40', 'AZ': '04', 'ID': '16', 'CT': '09', 'ME': '23', 'MD': '24', 'MA': '25', 'OH': '39', 'UT': '49', 'MO': '29', 'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MP': '69', 'MS': '28', 'PR': '72', 'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46'}

congressToBlockGroup = {}

with open("congress_block.csv","r")as abbrFile:
    csvReader = csv.reader(abbrFile)
    for row in csvReader:
        header = row
        print (row)
        break
    for row in csvReader:
        #print(row)
        congressId = row[header.index("GEOID")]
        bgId = row[header.index("GEOID20")]
        proportion = row[header.index("proportion")]
        
        if congressId in congressToBlockGroup.keys():
            congressToBlockGroup[congressId].append({"bg":bgId,"proportion":proportion})
        else:
            congressToBlockGroup[congressId]=[]
            congressToBlockGroup[congressId].append({"bg":bgId,"proportion":proportion})
    #print(congressToBlockGroup)
    
   # print(len(congressToBlockGroup.keys()))
    with open('congress_block.json', 'w') as f:
        json.dump(congressToBlockGroup, f)


#get 2019 data 
#get total population for congress totals by adding blockgroups
with open("DECENNIALPL2020.P1_data_with_overlays_2022-04-27T082527.csv","r")as bgFile:
    bgCsvReader = csv.reader(bgFile)
    popDict = {}
    for row in bgCsvReader:
        break
    for row in bgCsvReader:
        header = row
        print("block")
        #print("header",header)
        break
    for row in bgCsvReader:
        #print(row)
        geoid = row[header.index("id")].split("US")[1]
        pop = int(row[2])#int(row[header.index("!!Total:")])
        #print(geoid,pop)
        popDict[geoid]=pop
        #break
#print(popDict)

with open("ACSDT5Y2020.B01001_data_with_overlays_2022-07-15T224528.csv","r")as congressFile:
    congressReader = csv.reader(congressFile)
    congressDict = {}
    for row in congressReader:
        #print (row)
        break
    for row in congressReader:
        #\print (row)
        header = row
        break
    for row in congressReader:
        geoid = row[header.index("id")].split("US")[1]
        if geoid[0:2]=="01":
            pop = row[header.index("Estimate!!Total:")]
           # print(geoid,pop)
        

for c in congressToBlockGroup:
    congressData = congressToBlockGroup[c]
    #print(congressData)
    congressGeoid = c
    state = c[0:2]
    population = 0
    if state =="01":
        for d in congressData:
            #print(d)
            geoid = d["bg"]
            if geoid in popDict.keys():
                pop = float(popDict[geoid])
                proportion = float(d["proportion"])
                # print("data",pop, proportion)
                population+=(pop*proportion)
        print ("GIS Sum",congressGeoid, population)
        #print(c,congressData)
        #print(state)        
        #break
