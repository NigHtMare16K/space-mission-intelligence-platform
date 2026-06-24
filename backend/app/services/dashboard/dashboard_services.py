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
        "missions_completed": int(missions_completed),
        "upcoming_missions": int(upcoming_missions),
        "ongoing_missions": int(ongoing_missions),
        "avg_cost": float(avg_cost),
        "total_countries": int(total_countries),
        "launch_vehicles": int(launch_vehicles),
        "success_percentage": float(success_percentage)
}



def agency_analysis():

    completed = df[
        df['Status'].isin([
            'Success',
            'Failed',
            'Partial Success'
        ])
    ]

    agency_stats = (
        completed
        .groupby('Agency')
        .agg(
            total_missions=('Status', 'count'),
            successful_missions=(
                'Status',
                lambda x: (x == 'Success').sum()
            )
        )
    )

    # Keep only agencies with at least 20 missions
    agency_stats = agency_stats[
        agency_stats['total_missions'] >= 20
    ]

    agency_stats['success_rate'] = (
        agency_stats['successful_missions']
        / agency_stats['total_missions']
    ) * 100

    agency_stats = (
        agency_stats
        .sort_values(
            'success_rate',
            ascending=False
        )
        .round(2)
    )

    return (
        agency_stats
        .reset_index()
        .to_dict(orient='records')
    )



def yearly_trend():

    yearly = (
        df['Launch_Year']
        .value_counts()
        .sort_index()
    )

    return {
        "year": yearly.index.tolist(),
        "missions": yearly.values.tolist()
    }

def country_stats(country):

    df2 = df[df['Country_Region'] == country]

    total_miss = len(df2)

    upcoming = (df2['Status'] == 'Upcoming').sum()

    ongoing = (df2['Status'] == 'Ongoing').sum()

    completed = df2[
        df2['Status'].isin(
            ['Success', 'Failed', 'Partial Success']
        )
    ]

    if len(completed) > 0:
        success_rate = (
            (completed['Status'] == 'Success').sum()
            / len(completed)
        ) * 100
    else:
        success_rate = 0

    top_vehicle = df2['Launch_Vehicle'].mode().iloc[0]
    top_agency = df2['Agency'].mode().iloc[0]

    # Status chart
    status = (
        df2['Status']
        .value_counts()
    )

    # Mission categories
    category = (
        df2['Mission_Category']
        .value_counts()
    )

    # Yearly trend
    yearly = (
        df2['Launch_Year']
        .value_counts()
        .sort_index()
    )

    return {

        "overview": {
            "total_missions": int(total_miss),
            "upcoming_missions": int(upcoming),
            "ongoing_missions": int(ongoing),
            "success_rate": round(success_rate, 2),
            "top_vehicle": top_vehicle,
            "top_agency": top_agency
        },

        "status_distribution": {
            "status": status.index.tolist(),
            "count": status.values.tolist()
        },

        "mission_categories": {
            "category": category.index.tolist(),
            "missions": category.values.tolist()
        },

        "yearly_trend": {
            "year": yearly.index.tolist(),
            "missions": yearly.values.tolist()
        }
    }

def mission_category():

    category = (
        df['Mission_Category']
        .value_counts()
        .sort_values(ascending=True)
    )

    return {
        "category": category.index.tolist(),
        "missions": category.values.tolist()
    }

def status_distribution():

    status = (
        df['Status']
        .value_counts()
    )

    return {
        "status": status.index.tolist(),
        "count": status.values.tolist()
    }