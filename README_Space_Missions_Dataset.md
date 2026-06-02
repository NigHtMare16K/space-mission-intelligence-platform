# 🚀 Global Space Missions Dataset — README

---

## 📄 About This Dataset

This dataset is a comprehensive, structured collection of **10,500+ space mission records** spanning the entire history of human spaceflight and robotic exploration — from the first satellite launches in 1957 through active missions in 2026 and planned missions extending to 2035 and beyond.

It covers **12 of the world's leading space agencies and private companies**, including both government-run national programs and commercial space operators. Each row represents a unique space mission or launch event, enriched with 26 attributes covering operational, scientific, technical, and financial dimensions.

This dataset is ideal for data analysis, machine learning, visualization projects, academic research, and space enthusiast exploration.

---

## 🏢 Organizations Covered

| # | Organization | Full Name | Country / Region | Type |
|---|-------------|-----------|-----------------|------|
| 1 | **NASA** | National Aeronautics and Space Administration | USA | Government |
| 2 | **ROSCOSMOS** | State Space Corporation | Russia | Government |
| 3 | **CNSA** | China National Space Administration | China | Government |
| 4 | **ESA** | European Space Agency | Europe (22 Nations) | Government |
| 5 | **ISRO** | Indian Space Research Organisation | India | Government |
| 6 | **JAXA** | Japan Aerospace Exploration Agency | Japan | Government |
| 7 | **SpaceX** | Space Exploration Technologies Corp. | USA | Private |
| 8 | **CNES** | Centre National d'Études Spatiales | France | Government |
| 9 | **DLR** | German Aerospace Center | Germany | Government |
| 10 | **ASI** | Agenzia Spaziale Italiana | Italy | Government |
| 11 | **CSA** | Canadian Space Agency | Canada | Government |
| 12 | **Blue Origin** | Blue Origin LLC | USA | Private |
| + | **Joint Missions** | Multi-agency collaborative missions | Various | Mixed |

---

## 📊 Dataset Statistics

| Metric | Value |
|--------|-------|
| **Total Rows (Missions)** | 10,500+ |
| **Total Columns (Features)** | 26 |
| **Time Span** | 1957 – 2035+ |
| **Agencies / Organizations** | 12 + Joint |
| **File Format** | CSV (UTF-8) |
| **File Name** | Space_Missions_Dataset.csv |

### Breakdown by Mission Phase

| Phase | Count | Description |
|-------|-------|-------------|
| ✅ Past | ~6,835 | Completed missions (1957–2023) |
| 🔄 Ongoing | ~2,105 | Currently active missions (2020–2026) |
| 🔜 Future / Upcoming | ~1,560 | Planned missions (2026–2035+) |

### Breakdown by Mission Status

| Status | Description |
|--------|-------------|
| **Success** | Mission completed all or most primary objectives |
| **Failed** | Mission did not achieve primary objectives |
| **Partial Success** | Mission met some but not all objectives |
| **Ongoing** | Mission is currently active |
| **Upcoming** | Mission is planned / not yet launched |

---

## 📋 Column Descriptions

| # | Column Name | Data Type | Description |
|---|-------------|-----------|-------------|
| 1 | `Mission_ID` | String | Unique identifier (e.g., NA-00001, IS-00042) |
| 2 | `Mission_Name` | String | Official name of the mission |
| 3 | `Agency` | String | Space agency or company responsible |
| 4 | `Country_Region` | String | Country or region of the agency |
| 5 | `Agency_Type` | String | Government or Private |
| 6 | `Program_Type` | String | Category of program (Robotic, Human Spaceflight, Satellite, etc.) |
| 7 | `Mission_Category` | String | Primary destination/focus (Moon, Mars, Earth Orbit, etc.) |
| 8 | `Sub_Category` | String | Specific mission type (Orbiter, Lander, Rover, CubeSat, etc.) |
| 9 | `Launch_Date` | Date (YYYY-MM-DD) | Actual or planned launch date |
| 10 | `End_Date` | Date / N/A | Mission end date or N/A if ongoing/future |
| 11 | `Duration` | String | Mission duration in days or years |
| 12 | `Launch_Vehicle` | String | Rocket used for launch |
| 13 | `Launch_Site` | String | Launch facility or spaceport |
| 14 | `Status` | String | Success / Failed / Partial Success / Ongoing / Upcoming |
| 15 | `Mission_Phase` | String | Past / Ongoing / Future |
| 16 | `Crew_Type` | String | Crewed or Uncrewed |
| 17 | `Crew_Members` | String | Crew role names (if crewed), else N/A |
| 18 | `Destination` | String | Target destination of the mission |
| 19 | `Objective` | String | Primary mission scientific or operational goal |
| 20 | `Key_Achievement` | String | Notable result, discovery, or milestone |
| 21 | `Cost_USD_Million` | Float | Estimated mission cost in millions of USD |
| 22 | `Partner_Agencies` | String | Collaborating agencies (if any) |
| 23 | `Data_Returned` | String | Yes / No / Partial / N/A |
| 24 | `Failure_Reason` | String | Cause of failure (if applicable), else N/A |
| 25 | `Mission_Outcome_Detail` | String | Extended description of mission result |
| 26 | `Reference_URL` | String | Official agency reference link |

---

## 🗂️ Mission Categories Explained

| Category | Description |
|----------|-------------|
| **Moon** | Lunar orbiters, landers, rovers, sample return missions |
| **Mars** | Mars orbiters, landers, rovers, helicopter missions |
| **Deep Space** | Voyager-type probes, interstellar missions, outer solar system |
| **Earth Orbit** | LEO, MEO, GEO satellites, ISS missions |
| **Sun / Solar** | Solar observers, coronagraphs, L1 point missions |
| **Asteroid** | Flyby, rendezvous, sample return, deflection missions |
| **Venus** | Orbiters, atmospheric probes, landers |
| **Mercury** | Orbiters and flyby missions |
| **Jupiter / Saturn** | Outer planet orbiters, probes, moon studies |
| **ISS** | International Space Station crew and cargo missions |
| **Earth Observation** | Climate, weather, ocean, agriculture satellites |
| **Telescope** | Space-based observatories (optical, X-ray, infrared, radio) |
| **CubeSat / SmallSat** | Small satellite technology and science missions |
| **Technology Demo** | Propulsion tests, AI demos, in-orbit servicing |
| **Communication Satellite** | Broadband, GEO comsat, military communication |
| **Sounding Rocket** | Suborbital atmospheric and ionosphere studies |
| **Crewed Spaceflight** | Human spaceflight missions to LEO, Moon, station |

---

## 🚀 Key Missions Included (Highlights)

### NASA
- Apollo 1–17 (Moon Program), Space Shuttle STS-1 to STS-135
- Voyager 1 & 2, Hubble Space Telescope, James Webb Space Telescope
- Curiosity Rover, Perseverance Rover, Ingenuity Helicopter
- Artemis I, II, III, IV (Lunar Return Program)
- Europa Clipper, Dragonfly (Titan Mission), DART (Asteroid Deflection)

### ROSCOSMOS
- Sputnik 1 (World's First Satellite), Vostok 1 (First Human in Space)
- Mir Space Station, Soyuz/Progress ISS Missions
- Luna 25, 26, 27 (Lunar Exploration Return)
- Spektr-RG, Venera-D (Venus Mission)

### CNSA
- Shenzhou 5–20 (Crewed Missions), Tiangong Space Station
- Chang'e 1–7 (Lunar Exploration), Yutu / Yutu-2 Rovers
- Tianwen-1 (Mars), Zhurong Rover, Tianwen-2, 3, 4
- BeiDou Navigation Satellite System

### ESA
- Rosetta / Philae (Comet Mission), Mars Express, Venus Express
- BepiColombo (Mercury), JUICE (Jupiter), Solar Orbiter
- Gaia, Planck, Euclid, Herschel (Space Observatories)
- Ariane 5 / Ariane 6 / Vega Launch Programs

### ISRO
- Chandrayaan-1, 2, 3 (Lunar Missions), Pragyan Rover
- Mangalyaan (Mars Orbiter Mission) — Asia's First Mars Mission
- Aditya-L1 (Solar Mission), NISAR (Joint with NASA)
- Gaganyaan (India's First Crewed Spaceflight Program)

### SpaceX
- Falcon 1, Falcon 9, Falcon Heavy, Starship
- Crew Dragon (Commercial Crew), CRS ISS Resupply
- Starlink Satellite Constellation (V1 to V2)
- Starship Integrated Flight Tests (IFT-1 through IFT-7+)

---

## 💡 Suggested Use Cases

- **Data Visualization** — Timeline charts, agency comparison dashboards, mission success rate plots
- **Machine Learning** — Mission success/failure prediction, cost estimation models, NLP on objectives
- **Academic Research** — Space policy analysis, history of spaceflight, commercial space growth
- **Business Intelligence** — Budget analysis, partner agency network graphs
- **Education** — Interactive teaching tool for space history and STEM programs
- **Journalism / Infographics** — Fact-based space exploration storytelling

---

## 📌 Important Notes

1. **Historical missions** (pre-2000) use approximate dates and costs based on publicly available records.
2. **Future missions** (2026–2035) reflect planned programs announced by agencies as of 2026; dates are subject to change.
3. **Cost estimates** for some missions are approximate or represent best public estimates.
4. **Joint missions** are listed under the lead agency with partner agencies noted in the `Partner_Agencies` column.
5. **Crew member names** in this dataset use role designations (Commander, Pilot, MS1, etc.) as placeholders.

---

## 📁 File Information

| Property | Value |
|----------|-------|
| File Name | `Space_Missions_Dataset.csv` |
| Format | CSV (Comma-Separated Values) |
| Encoding | UTF-8 |
| Header Row | Yes (Row 1) |
| Delimiter | Comma `,` |
| Date Format | YYYY-MM-DD |
| Missing Values | Represented as `N/A` |

---

## 🔗 Official Sources & References

- NASA: https://www.nasa.gov
- ISRO: https://www.isro.gov.in
- CNSA: http://www.cnsa.gov.cn
- ESA: https://www.esa.int
- ROSCOSMOS: https://www.roscosmos.ru
- JAXA: https://www.jaxa.jp
- SpaceX: https://www.spacex.com
- CNES: https://cnes.fr
- DLR: https://www.dlr.de
- ASI: https://www.asi.it
- CSA: https://www.asc-csa.gc.ca
- Blue Origin: https://www.blueorigin.com

---

## 📅 Dataset Version

| Field | Detail |
|-------|--------|
| Version | 1.0 |
| Created | May 2026 |
| Last Updated | May 2026 |
| Coverage | 1957 – 2035+ |
| Total Records | 10,500+ |

---

*This dataset was compiled for educational, research, and analytical purposes. All mission names, agency names, and historical data are based on publicly available information.*
