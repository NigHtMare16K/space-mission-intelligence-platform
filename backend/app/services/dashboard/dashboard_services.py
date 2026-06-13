import numpy as np
import pandas as pd 
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('D:/Data Analysis/Space Mission Analysis/Dataset/Space_Missions_Dataset.csv')
df['Launch_Year'] = df['Launch_Date'].str.split("-").str[0]

def overview_stats():

    total_missions = len(df)

    missions_completed = df[
        ~df['Status'].isin(['Ongoing', 'Upcoming'])
    ].shape[0]

    upcoming_missions = (df['Status'] == 'Upcoming').sum()

    ongoing_missions = (df['Status'] == 'Ongoing').sum()

    avg_cost = round(df['Cost_USD_Million'].mean(), 2)

    total_countries = df['Country_Region'].nunique()

    launch_vehicles = df['Launch_Vehicle'].nunique()

    completed = df[
        df['Status'].isin(
            ['Success', 'Failed', 'Partial Success']
        )
    ]

    success_percentage = (
        (completed['Status'] == 'Success').sum()
        / len(completed)
    ) * 100

    return {
        "total_missions": int(total_missions),
        "missions_completed": int(mission_completed),
        "upcoming_missions": int(upcoming_mission),
        "ongoing_missions": int(ongoing_missions),
        "avg_cost": float(avg_cost),
        "total_countries": int(total_countries),
        "launch_vehicles": int(launch_vehicles),
        "succ_percentage": float(succ_perc)
    }