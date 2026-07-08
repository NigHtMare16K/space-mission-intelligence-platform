import joblib

cosine_sim = joblib.load("artifacts/cosine_similarity.pkl")
data = joblib.load("artifacts/recommendation_data.pkl")

def recommend_missions(
    mission_name,
    cosine_sim=cosine_sim,
    df=data,
    top_n=5
):

    idx = df[
        df["Mission_Name"].str.lower() == mission_name.lower()
    ].index

    if len(idx) == 0:
        return {
            "error": "Mission not found in dataset."
        }

    idx = idx[0]

    sim_scores = list(enumerate(cosine_sim[idx]))

    sim_scores = sorted(
        sim_scores,
        key=lambda x: x[1],
        reverse=True
    )

    sim_scores = sim_scores[1:top_n + 1]

    mission_indices = [i[0] for i in sim_scores]

    recommendations = df.iloc[mission_indices].copy()

    recommendations["similarity"] = [
        round(score, 3)
        for _, score in sim_scores
    ]

    return (
        recommendations[
            [
                "Mission_Name",
                "Launch_Year",
                "Cost_USD_Million",
                "similarity"
            ]
        ]
        .rename(
            columns={
                "Mission_Name": "mission_name",
                "Launch_Year": "launch_year",
                "Cost_USD_Million": "budget"
            }
        )
        .to_dict(orient="records")
    )