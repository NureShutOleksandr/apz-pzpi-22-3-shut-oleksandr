package com.example.myapp.data

data class RoomAnalysis(
  val analysis: Analysis
)

data class Analysis(
  val statistics: Statistics,
  val correlation: Map<String, Double?>,
  val trends: List<String>,
  val recommendations: List<String>,
  val regression: String
)

data class Statistics(
  val temperature_mean: Double,
  val temperature_median: Double,
  val temperature_min: Double,
  val temperature_max: Double,
  val moisture_mean: Double,
  val moisture_median: Double,
  val moisture_min: Double,
  val moisture_max: Double,
  val carbonDioxide_mean: Double,
  val carbonDioxide_median: Double,
  val carbonDioxide_min: Double,
  val carbonDioxide_max: Double,
  val illumination_mean: Double,
  val illumination_median: Double,
  val illumination_min: Double,
  val illumination_max: Double
)