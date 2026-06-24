from catboost import CatBoostClassifier

model = CatBoostClassifier()

model.load_model("D:/Data Analysis/Space Mission Analysis/backend/app/model/mission_success_model.cbm")

import pandas as pd


def predict_success(data):

    input_data = pd.DataFrame([{
        "Agency": data.Agency,
        "Agency_Type": data.Agency_Type,
        "Program_Type": data.Program_Type,
        "Mission_Category": data.Mission_Category,
        "Sub_Category": data.Sub_Category,
        "Launch_Vehicle": data.Launch_Vehicle,
        "Launch_Site": data.Launch_Site,
        "Crew_Type": data.Crew_Type,
        "Destination": data.Destination,
        "Cost_USD_Million": data.Cost_USD_Million,
        "Launch_Year": data.Launch_Year,
        "Country_Region": data.Country_Region
    }])

    prediction = model.predict(input_data)[0]

    probability = model.predict_proba(
        input_data
    )[0][1]

    return {
        "prediction":
            "Success" if prediction == 1 else "Failure",

        "success_probability":
            round(probability * 100, 2)
    }

