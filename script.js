// Weather Dashboard JavaScript
// Global variables
let weatherData = [];
const tooltip = d3.select("#global-tooltip");

// Initialize dashboard
function init() {
  loadWeatherData();
  setupEventListeners();
}

// Load and parse weather data
function loadWeatherData() {
  d3.csv("MYweather.csv").then(function(data) {
    // Parse date and temperature values
    weatherData = data.map(function(d) {
      return {
        datetime: new Date(d.datetime),
        temp: +d.temp,
        tempmax: +d.tempmax,
        tempmin: +d.tempmin,
        windspeed: +d.windspeed,
        humidity: +d.humidity,
        precip: +d.precip
      };
    });

    // Initial update with all data
    updateDashboard();
  }).catch(function(error) {
    console.error("Error loading weather data:", error);
    showError("Failed to load weather data");
  });
}

// Setup event listeners
function setupEventListeners() {
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  
  startDateInput.addEventListener("change", updateDashboard);
  endDateInput.addEventListener("change", updateDashboard);
}

// Main update function
function updateDashboard() {
  const filteredData = getFilteredData();
  
  updateTemperatureChart(filteredData);
  updateWindSpeedChart(filteredData);
  updateHumidityTemperatureChart(filteredData);
  updateTemperatureHeatmap(filteredData);
  updateStatistics(filteredData);
}

// Get filtered data based on date range
function getFilteredData() {
  const startDate = new Date(document.getElementById("start-date").value);
  const endDate = new Date(document.getElementById("end-date").value);
  
  if (!startDate || !endDate) {
    return weatherData;
  }
  
  return weatherData.filter(d => d.datetime >= startDate && d.datetime <= endDate);
}

// Update temperature chart
function updateTemperatureChart(data) {
  const container = "#temperature-chart";
  const config = {
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
    width: 1000,
    height: 300
  };
  
  const { width, height } = calculateDimensions(config);
  const svg = setupSVG(container, config);
  
  // Scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.datetime))
    .range([0, width]);
    
  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.tempmin), d3.max(data, d => d.tempmax)])
    .range([height, 0]);
  
  // Line generator
  const line = d3.line()
    .x(d => xScale(d.datetime))
    .y(d => yScale(d.temp))
    .curve(d3.curveMonotoneX);
  
  // Add line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#3b82f6")
    .attr("stroke-width", 2)
    .attr("d", line);
  
  // Add data points
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => xScale(d.datetime))
    .attr("cy", d => yScale(d.temp))
    .attr("r", 3)
    .style("fill", "#3b82f6")
    .on("mouseover", (event, d) => showTooltip(event, `Date: ${d.datetime.toDateString()}<br>Temperature: ${d.temp}°C`))
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);
  
  // Add axes
  addAxes(svg, xScale, yScale, width, height);
  addLabels(svg, "Date", "Temperature (°C)", config);
}

// Update wind speed chart
function updateWindSpeedChart(data) {
  const container = "#wind-speed-chart";
  const config = {
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
    width: 1000,
    height: 300
  };
  
  const { width, height } = calculateDimensions(config);
  const svg = setupSVG(container, config);
  
  // Scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.datetime))
    .range([0, width]);
    
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.windspeed)])
    .nice()
    .range([height, 0]);
  
  // Area generator
  const area = d3.area()
    .x(d => xScale(d.datetime))
    .y0(height)
    .y1(d => yScale(d.windspeed));
  
  // Add area
  svg.append("path")
    .datum(data)
    .attr("fill", "#10b981")
    .attr("d", area)
    .style("fill-opacity", 0.7);
  
  // Add data points
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => xScale(d.datetime))
    .attr("cy", d => yScale(d.windspeed))
    .attr("r", 3)
    .style("fill", "#10b981")
    .on("mouseover", (event, d) => showTooltip(event, `Date: ${d.datetime.toLocaleDateString()}<br>Wind Speed: ${d.windspeed} km/h`))
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);
  
  // Add axes
  addAxes(svg, xScale, yScale, width, height);
  addLabels(svg, "Date", "Wind Speed (km/h)", config);
}

// Update humidity vs temperature scatter plot
function updateHumidityTemperatureChart(data) {
  const container = "#humidity-temperature-chart";
  const config = {
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
    width: 1000,
    height: 300
  };
  
  const { width, height } = calculateDimensions(config);
  const svg = setupSVG(container, config);
  
  // Scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.humidity)])
    .range([0, width]);
    
  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.tempmin), d3.max(data, d => d.tempmax)])
    .range([height, 0]);
  
  // Add scatter points
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => xScale(d.humidity))
    .attr("cy", d => yScale(d.temp))
    .attr("r", 4)
    .attr("fill", "#8b5cf6")
    .attr("opacity", 0.7)
    .on("mouseover", (event, d) => showTooltip(event, `Humidity: ${d.humidity}%<br>Temperature: ${d.temp}°C`))
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);
  
  // Add axes
  addAxes(svg, xScale, yScale, width, height);
  addLabels(svg, "Humidity (%)", "Temperature (°C)", config);
}

// Update temperature heatmap
function updateTemperatureHeatmap(data) {
  const container = "#heatmap-chart";
  const config = {
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
    width: 1000,
    height: 250
  };
  
  const { width, height } = calculateDimensions(config);
  const svg = setupSVG(container, config);
  
  // Scales
  const xScale = d3.scaleBand()
    .domain(Array.from({ length: 31 }, (_, i) => i + 1))
    .range([0, width])
    .padding(0.1);
  
  const uniqueMonths = Array.from(new Set(data.map(d => d.datetime.getMonth())));
  const yScale = d3.scaleBand()
    .domain(uniqueMonths)
    .range([height, 0])
    .padding(0.1);
  
  const colorScale = d3.scaleSequential()
    .domain([d3.min(data, d => d.temp), d3.max(data, d => d.temp)])
    .interpolator(d3.interpolateRgb("#fbbf24", "#f97316", "#ef4444"));
  
  // Add heatmap rectangles
  svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", d => xScale(d.datetime.getDate()))
    .attr("y", d => yScale(d.datetime.getMonth()))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", d => colorScale(d.temp))
    .on("mouseover", (event, d) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      showTooltip(event, `Date: ${monthNames[d.datetime.getMonth()]} ${d.datetime.getDate()}<br>Temperature: ${d.temp}°C`);
    })
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);
  
  // Add axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));
  
  svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(d => d3.timeFormat("%B")(new Date(2000, d))));
  
  // Add labels
  addLabels(svg, "Day", "Month", config);
}

// Update statistics widgets
function updateStatistics(data) {
  const maxTemp = d3.max(data, d => d.tempmax);
  const minTemp = d3.min(data, d => d.tempmin);
  const totalPrecip = d3.sum(data, d => d.precip);
  const totalRainDays = data.filter(d => d.precip > 0).length;
  const maxWind = d3.max(data, d => d.windspeed);
  
  document.getElementById("max-temp").textContent = `${maxTemp}°C`;
  document.getElementById("min-temp").textContent = `${minTemp}°C`;
  document.getElementById("total-precip").textContent = `${totalPrecip.toFixed(2)} mm`;
  document.getElementById("total-rain-days").textContent = `${totalRainDays}`;
  document.getElementById("max-wind").textContent = `${maxWind} km/h`;
}

// Utility functions
function calculateDimensions(config) {
  const { margin, width: totalWidth, height: totalHeight } = config;
  return {
    width: totalWidth - margin.left - margin.right,
    height: totalHeight - margin.top - margin.bottom
  };
}

function setupSVG(container, config) {
  const { margin, width: totalWidth, height: totalHeight } = config;
  const { width, height } = calculateDimensions(config);
  
  // Clear previous chart
  d3.select(`${container} svg`).selectAll("*").remove();
  
  return d3.select(`${container} svg`)
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
}

function addAxes(svg, xScale, yScale, width, height) {
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));
  
  svg.append("g")
    .call(d3.axisLeft(yScale));
}

function addLabels(svg, xLabel, yLabel, config) {
  const { margin, width: totalWidth, height: totalHeight } = config;
  const { width, height } = calculateDimensions(config);
  
  // X-axis label
  svg.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .style("text-anchor", "middle")
    .text(xLabel);
  
  // Y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yLabel);
}

// Tooltip functions
function showTooltip(event, content) {
  tooltip.style("display", "block")
    .html(content);
}

function moveTooltip(event) {
  tooltip.style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 10) + "px");
}

function hideTooltip() {
  tooltip.style("display", "none");
}

// Error handling
function showError(message) {
  const container = document.querySelector('.container');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  container.appendChild(errorDiv);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);