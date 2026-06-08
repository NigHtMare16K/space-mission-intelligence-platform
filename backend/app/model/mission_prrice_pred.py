import numpy as np
import pandas as pd 
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from catboost import CatBoostRegressor

df = pd.read_csv('D:/Data Analysis/Space Mission Analysis/Dataset/Space_Missions_Dataset.csv')

df['Launch_Year'] = df['Launch_Date'].str.split("-").str[0]

df1 = df[['Agency','Agency_Type','Program_Type','Mission_Category','Sub_Category','Launch_Vehicle','Launch_Site','Status','Crew_Type','Destination','Cost_USD_Million','Partner_Agencies','Launch_Year','Country_Region']]

df1 = df1[(df1['Status'] != 'Ongoing') & (df1['Status'] != 'Upcoming')]

df1['Status'] = df1['Status'].map({
    'Success': 1,
    'Failed': 0,
    'Partial Success': 0
})

df1['Agency_Type'] = df1['Agency_Type'].map({'Government': 1, 'Private': 0})

df1['Cost_USD_Million'] = pd.to_numeric(
    df1['Cost_USD_Million'],
    errors='coerce'
)

df1['Launch_Year'] = pd.to_numeric(
    df1['Launch_Year'],
    errors='coerce'
)

df1['Partner_Count'] = (
    df1['Partner_Agencies']
    .fillna('')
    .str.split(',')
    .apply(lambda x: len(x) if x != [''] else 0)
)

df1 = df1.drop(columns=['Partner_Agencies'])

df1['Partner_Count'] = pd.to_numeric(
    df1['Partner_Count'],
    errors='coerce'
)

X = df1.drop(
    ['Cost_USD_Million', 'Status'],
    axis=1
)
y = df1['Cost_USD_Million']

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

cat_features = [
    'Agency',
    'Program_Type',
    'Mission_Category',
    'Sub_Category',
    'Launch_Vehicle',
    'Launch_Site',
    'Crew_Type',
    'Destination',
    'Country_Region'
]

model = CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    depth=6,
    loss_function='RMSE',
    eval_metric='RMSE',
    verbose=100
)

model.fit(
    X_train,
    y_train,
    cat_features=cat_features,
    eval_set=(X_test, y_test)
)

y_pred = model.predict(X_test)

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"MAE : {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R²  : {r2:.4f}")