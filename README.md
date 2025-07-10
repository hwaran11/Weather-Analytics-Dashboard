# 🌤️ Weather Analytics Dashboard

This is a final-year group project developed for the subject **TEB3133 Data Visualization** at **Universiti Teknologi PETRONAS (UTP)**. The project focuses on visualizing Malaysia’s weather data for the year 2023 using **D3.js**, **vanilla JavaScript**, and **real-world data**.

> 🔗 **Live Demo:** [https://weather-analytics-dashboard.netlify.app/](https://weather-analytics-dashboard.netlify.app/)

---

## 👥 Group Members

| Name                       | Student ID |
| -------------------------- | ---------- |
| Hervishwaran Sivappragasam | 20000462   |
| Sanjif Chandra Sekaran     | 20000461   |
| Padthmaruben Kumar         | 20000823   |

---

## 🧠 Project Overview

The dashboard allows users to explore Malaysia's weather conditions for 2023 through dynamic and interactive charts. Key features include:

* 📈 **Line Chart** – Temperature trends
* 💨 **Area Chart** – Wind speed variation
* 💧 **Scatter Plot** – Humidity vs Temperature
* 🔥 **Heatmap** – Daily Temperature Pattern
* 📊 **Widgets** – Max Temp, Min Temp, Rain Days, Wind Speed
* 📅 **Date Filtering** – User-selectable range

---

## 🎓 Academic Context

* **Course**: TEB3133 – Data Visualization
* **Semester**: Final Year, Semester 7
* **Dataset Source**: [VisualCrossing](https://www.visualcrossing.com/)

---

## 🛠️ Technologies Used

* **HTML5, CSS3**
* **JavaScript (Vanilla)**
* **D3.js v7**
* **Netlify** (for live deployment)

---

## 📂 Folder Structure

```
weather-dashboard/
├── index.html        → Main page
├── styles.css        → Styling and layout
├── script.js         → D3.js charts and logic
├── MYweather.csv     → Weather data (required)
└── README.md         → Project documentation
```

---

## 📊 Dataset Structure

| Column      | Description          |
| ----------- | -------------------- |
| `datetime`  | Date (YYYY-MM-DD)    |
| `temp`      | Avg Temperature (°C) |
| `tempmax`   | Max Temperature (°C) |
| `tempmin`   | Min Temperature (°C) |
| `windspeed` | Wind Speed (km/h)    |
| `humidity`  | Humidity (%)         |
| `precip`    | Precipitation (mm)   |

---

## 🧪 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/hwaran11/Weather-Dashboard.git

# Start a local server (needed for CSV)
python -m http.server 8000
# or
npx http-server

# Open browser
http://localhost:8000
```

---

## 🔍 Insights from Our Findings

* 📌 Temperature peaked in May 2023 (30.6°C)
* 📌 Wind speed was highest during warmer periods
* 📌 Inverse relationship between temperature and humidity
* 📌 February & March were cooler than April & May

---

## 📈 Chart Interactivity

* **Hoverable tooltips**
* **Responsive layout for mobile & desktop**
* **Live chart updates based on date range**

---

## 📝 License

This project is open-source under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

* **VisualCrossing** – For weather data
* **UTP Lecturers** – For guidance under TEB3133
* **Group members** – For collaboration and effort
