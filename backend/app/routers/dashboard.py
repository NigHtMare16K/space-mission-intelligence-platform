from fastapi import APIRouter

from app.services.dashboard.dashboard_services import (
    overview_stats,
    status_distribution,
    mission_category,
    country_stats,
    agency_analysis,
    yearly_trend,
    country_list,
    country_map_data,
)

router = APIRouter(
    prefix="/dashboard",
    tags=['Dashboard']
)

@router.get("/overview")
def get_overview():
    try:
        return overview_stats()
    except Exception as e:
        print(e)
        raise e

@router.get("/agency-analysis")
def get_agencies():
    return agency_analysis()

@router.get("/yearly-trend")
def get_yearly():
    return yearly_trend()

@router.get("/status-distribution")
def get_status():
    return status_distribution()


@router.get("/mission-category")
def get_mission_category():
    return mission_category()

@router.get("/country-stats")
def get_country_stats(country: str):
    return country_stats(country)

@router.get("/country/{country}")
def get_country_by_path(country: str):
    return country_stats(country)

@router.get("/countries")
def get_countries():
    return country_list()

@router.get("/country-map")
def get_country_map():
    return country_map_data()