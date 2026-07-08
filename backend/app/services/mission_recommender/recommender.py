import numpy as np 
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from wordcloud import WordCloud
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

df = pd.read_csv('D:/Data Analysis/Space Mission Analysis/Dataset/Space_Missions_Dataset.csv')

df['Launch_Year'] = df['Launch_Date'].str.split("-").str[0]

required_columns = ["Mission_Name","Agency","Country_Region","Agency_Type","Mission_Category","Launch_Vehicle","Status","Mission_Phase","Crew_Type","Objective","Mission_Outcome_Detail","Destination","Cost_USD_Million","Launch_Year"]
df1 = df[required_columns]

df1['combined'] = df1['Agency'] + ' ' + df1['Country_Region'] + ' ' +df1['Agency_Type'] + ' ' + df1['Mission_Category'] + ' ' + df1['Launch_Vehicle'] + ' ' +  df1['Status'] + ' ' + df1['Mission_Phase'] + ' ' + df1['Crew_Type'] + ' ' + df1['Objective'] + ' ' + df1['Destination'] + ' ' + df1['Mission_Outcome_Detail'] 

data  = df1[['Mission_Name','combined','Cost_USD_Million','Launch_Year']]

nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')

stop_words = set(stopwords.words('english'))


def preprocess_text(text):
    # Remove special characters and numbers
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    # Convert to lowercase
    text = text.lower()
    # Tokenize and remove stopwords
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

data['cleaned_text'] = df1['combined'].apply(preprocess_text)

tfidf = TfidfVectorizer(max_features=5000)
tfidf_matrix = tfidf.fit_transform(data['cleaned_text'])

cosine_sim = cosine_similarity(tfidf_matrix,tfidf_matrix)

import joblib
import os

os.makedirs("artifacts", exist_ok=True)

joblib.dump(tfidf, "artifacts/tfidf_vectorizer.pkl")
joblib.dump(cosine_sim, "artifacts/cosine_similarity.pkl")
joblib.dump(data, "artifacts/recommendation_data.pkl")

print("Artifacts Saved Successfully")

# def recommend_missions(mission_name, cosine_sim=cosine_sim, df=data, top_n=5):
#     # Find the index of the movie
#     idx = df[df['Mission_Name'].str.lower() == mission_name.lower()].index
#     if len(idx) == 0:
#         return "Mission not found in the dataset!"
#     idx = idx[0]

#     # Get similarity scores
#     sim_scores = list(enumerate(cosine_sim[idx]))
#     sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
#     sim_scores = sim_scores[1:top_n+1]

#     # Get movie indices
#     mission_indices = [i[0] for i in sim_scores]

#     # Return top n similar movies
#     return df[['Mission_Name']].iloc[mission_indices]