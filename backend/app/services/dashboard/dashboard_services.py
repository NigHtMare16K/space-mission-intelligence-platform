import numpy as np
import pandas as pd 
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('D:/Data Analysis/Space Mission Analysis/Dataset/Space_Missions_Dataset.csv')
df['Launch_Year'] = df['Launch_Date'].str.split("-").str[0]

def overview_servive():
    total_missions = df['Status'].value_counts().sum()
    mission_completed = df[(df['Status'] != 'Ongoing') & (df['Status'] != 'Upcoming')]['Status'].value_counts().sum()
