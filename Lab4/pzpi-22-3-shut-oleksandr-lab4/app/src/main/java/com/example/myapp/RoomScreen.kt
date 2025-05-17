package com.example.myapp

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.example.myapp.api.RetrofitClient
import com.example.myapp.data.Room
import com.example.myapp.data.RoomAnalysis
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import kotlinx.coroutines.launch
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoomScreen(
  room: Room,
  onAnalyze: suspend (String) -> RoomAnalysis?,
  onNavigateBack: () -> Unit
) {
  val coroutineScope = rememberCoroutineScope()
  var roomAnalysis by remember { mutableStateOf<RoomAnalysis?>(null) }
  var isAnalysisVisible by remember { mutableStateOf(false) }
  var isLoading by remember { mutableStateOf(false) }
  var snackbarMessage by remember { mutableStateOf<String?>(null) }
  val snackbarHostState = remember { SnackbarHostState() }

  val locale = LocalConfiguration.current.locales[0]
  val isCelsius = locale.language != "en"

  val temperatureToDisplay: (Double) -> String = { temp ->
    if (isCelsius) {
      String.format("%.1f°C", temp)
    } else {
      val fahrenheit = temp * 9 / 5 + 32
      String.format("%.1f°F", fahrenheit)
    }
  }

  val handleAnalyzeData: () -> Unit = {
    coroutineScope.launch {
      isLoading = true
      var success = false
      var failed = false
      try {
        val analysis = onAnalyze(room._id)
        if (analysis != null) {
          roomAnalysis = analysis
          isAnalysisVisible = true
          Log.d("MyApp", "Room analysis loaded: $roomAnalysis")
          success = true
        } else {
          failed = true
          Log.d("MyApp", "Failed to analyze room: analysis is null")
        }
      } catch (e: Exception) {
        snackbarMessage = "error" // Використовуємо тимчасовий код помилки
        Log.e("MyApp", "Error analyzing room: ${e.message}", e)
      } finally {
        isLoading = false
        if (success) {
          snackbarMessage = "success"
        } else if (failed) {
          snackbarMessage = "failed"
        }
      }
    }
  }

  Scaffold(
    topBar = {
      TopAppBar(
        title = { Text(stringResource(R.string.room_title)) },
        navigationIcon = {
          IconButton(onClick = onNavigateBack) {
            Text(
              text = "←",
              fontSize = 24.sp,
              color = Color(0xFF1e1e1e)
            )
          }
        },
        colors = TopAppBarDefaults.topAppBarColors(
          containerColor = Color(0xFFf5f5f5),
          titleContentColor = Color(0xFF1e1e1e)
        )
      )
    },
    snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
  ) { innerPadding ->
    LazyColumn(
      modifier = Modifier
        .fillMaxSize()
        .background(Color(0xFFf5f5f5))
        .padding(innerPadding)
        .padding(horizontal = 16.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      item {
        Surface(
          modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
          shape = RoundedCornerShape(12.dp),
          shadowElevation = 4.dp,
          color = Color.White
        ) {
          Column(
            modifier = Modifier
              .padding(24.dp)
              .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
          ) {
            Text(
              text = room.roomName,
              fontSize = 24.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFF1e1e1e)
            )
            Column(
              modifier = Modifier.fillMaxWidth(),
              verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              Text(
                text = stringResource(R.string.room_temperature, temperatureToDisplay(room.temperature)),
                fontSize = 16.sp,
                color = Color(0xFF7f8c8d)
              )
              Text(
                text = stringResource(R.string.room_moisture, String.format("%.1f%%", room.moisture)),
                fontSize = 16.sp,
                color = Color(0xFF7f8c8d)
              )
              Text(
                text = stringResource(R.string.room_co2, String.format("%.1f ppm", room.carbonDioxide)),
                fontSize = 16.sp,
                color = Color(0xFF7f8c8d)
              )
              Text(
                text = stringResource(R.string.room_illumination, String.format("%.1f lux", room.illumination)),
                fontSize = 16.sp,
                color = Color(0xFF7f8c8d)
              )
            }
            Button(
              onClick = handleAnalyzeData,
              modifier = Modifier.fillMaxWidth(),
              shape = RoundedCornerShape(8.dp),
              enabled = !isLoading,
              colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFFe74c3c),
                contentColor = Color.White
              )
            ) {
              if (isLoading) {
                CircularProgressIndicator(
                  modifier = Modifier.size(24.dp),
                  color = Color.White
                )
              } else {
                Text(
                  text = stringResource(R.string.analyze_button),
                  fontSize = 16.sp,
                  fontWeight = FontWeight.Medium
                )
              }
            }
          }
        }
      }

      if (isAnalysisVisible && roomAnalysis != null) {
        item {
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
          ) {
            Text(
              text = stringResource(R.string.analytics_section),
              fontSize = 20.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFF1e1e1e)
            )

            val statsData = roomAnalysis?.analysis?.statistics
            if (statsData != null) {
              val parametersStats = listOf(
                ParameterStat(
                  name = stringResource(R.string.rooms_dashboard_temperature),
                  mean = statsData.temperature_mean,
                  median = statsData.temperature_median,
                  min = statsData.temperature_min,
                  max = statsData.temperature_max
                ),
                ParameterStat(
                  name = stringResource(R.string.rooms_dashboard_moisture),
                  mean = statsData.moisture_mean,
                  median = statsData.moisture_median,
                  min = statsData.moisture_min,
                  max = statsData.moisture_max
                ),
                ParameterStat(
                  name = stringResource(R.string.rooms_dashboard_co2),
                  mean = statsData.carbonDioxide_mean,
                  median = statsData.carbonDioxide_median,
                  min = statsData.carbonDioxide_min,
                  max = statsData.carbonDioxide_max
                ),
                ParameterStat(
                  name = stringResource(R.string.rooms_dashboard_illumination),
                  mean = statsData.illumination_mean,
                  median = statsData.illumination_median,
                  min = statsData.illumination_min,
                  max = statsData.illumination_max
                )
              )

              Text(
                text = stringResource(R.string.parameter_stats),
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF2c3e50)
              )

              parametersStats.forEach { param ->
                BarChartView(
                  parameterStat = param,
                  modifier = Modifier
                    .fillMaxWidth()
                    .height(250.dp)
                    .padding(vertical = 8.dp),
                  isCelsius = isCelsius
                )
              }
            }

            Text(
              text = stringResource(R.string.correlations_section),
              fontSize = 18.sp,
              fontWeight = FontWeight.SemiBold,
              color = Color(0xFF2c3e50)
            )
            Surface(
              modifier = Modifier.fillMaxWidth(),
              shape = RoundedCornerShape(8.dp),
              color = Color.White,
              shadowElevation = 2.dp
            ) {
              Column {
                Row(
                  modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFf5f5f5))
                    .padding(8.dp),
                  horizontalArrangement = Arrangement.SpaceBetween
                ) {
                  Text(
                    text = stringResource(R.string.parameter_pair),
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF333333),
                    modifier = Modifier.weight(1f)
                  )
                  Text(
                    text = stringResource(R.string.correlation_coefficient),
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF333333),
                    modifier = Modifier.weight(1f),
                    textAlign = androidx.compose.ui.text.style.TextAlign.End
                  )
                }
                roomAnalysis?.analysis?.correlation?.forEach { (pair, value) ->
                  Row(
                    modifier = Modifier
                      .fillMaxWidth()
                      .padding(horizontal = 8.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                  ) {
                    Text(
                      text = pair.replace("-", " and "),
                      color = Color(0xFF7f8c8d),
                      modifier = Modifier.weight(1f)
                    )
                    Text(
                      text = if (value != null) String.format("%.2f", value) else stringResource(R.string.no_data),
                      color = Color(0xFF7f8c8d),
                      modifier = Modifier.weight(1f),
                      textAlign = androidx.compose.ui.text.style.TextAlign.End
                    )
                  }
                  Divider(color = Color(0xFFdddddd))
                }
              }
            }

            Text(
              text = stringResource(R.string.trends_section),
              fontSize = 18.sp,
              fontWeight = FontWeight.SemiBold,
              color = Color(0xFF2c3e50)
            )
            roomAnalysis?.analysis?.trends?.forEach { trend ->
              Row(
                modifier = Modifier.padding(vertical = 4.dp)
              ) {
                Text(
                  text = "• ",
                  color = Color(0xFF4a90e2),
                  fontSize = 16.sp
                )
                Text(
                  text = trend,
                  color = Color(0xFF2c3e50),
                  fontSize = 16.sp
                )
              }
            }

            Text(
              text = stringResource(R.string.recommendations_section),
              fontSize = 18.sp,
              fontWeight = FontWeight.SemiBold,
              color = Color(0xFF2c3e50)
            )
            roomAnalysis?.analysis?.recommendations?.forEach { recommendation ->
              Row(
                modifier = Modifier.padding(vertical = 4.dp)
              ) {
                Text(
                  text = "✔ ",
                  color = Color(0xFF27ae60),
                  fontSize = 16.sp
                )
                Text(
                  text = recommendation,
                  color = Color(0xFF2c3e50),
                  fontSize = 16.sp
                )
              }
            }

            Text(
              text = stringResource(R.string.regression_section),
              fontSize = 18.sp,
              fontWeight = FontWeight.SemiBold,
              color = Color(0xFF2c3e50)
            )
            Text(
              text = roomAnalysis?.analysis?.regression ?: stringResource(R.string.no_data),
              color = Color(0xFF7f8c8d),
              fontStyle = FontStyle.Italic,
              fontSize = 16.sp
            )
          }
        }
      }
    }
  }
}

data class ParameterStat(
  val name: String,
  val mean: Double,
  val median: Double,
  val min: Double,
  val max: Double
)

@Composable
fun BarChartView(
  parameterStat: ParameterStat,
  modifier: Modifier = Modifier,
  isCelsius: Boolean
) {
  val meanValue = if (isCelsius || parameterStat.name != stringResource(R.string.rooms_dashboard_temperature)) {
    parameterStat.mean
  } else {
    parameterStat.mean * 9 / 5 + 32
  }
  val medianValue = if (isCelsius || parameterStat.name != stringResource(R.string.rooms_dashboard_temperature)) {
    parameterStat.median
  } else {
    parameterStat.median * 9 / 5 + 32
  }
  val minValue = if (isCelsius || parameterStat.name != stringResource(R.string.rooms_dashboard_temperature)) {
    parameterStat.min
  } else {
    parameterStat.min * 9 / 5 + 32
  }
  val maxValue = if (isCelsius || parameterStat.name != stringResource(R.string.rooms_dashboard_temperature)) {
    parameterStat.max
  } else {
    parameterStat.max * 9 / 5 + 32
  }

  AndroidView(
    modifier = modifier,
    factory = { context ->
      BarChart(context).apply {
        description.isEnabled = false
        setFitBars(true)
        setDrawGridBackground(false)

        xAxis.apply {
          position = XAxis.XAxisPosition.BOTTOM
          setDrawGridLines(false)
          valueFormatter = IndexAxisValueFormatter(listOf(parameterStat.name))
        }

        axisLeft.setDrawGridLines(true)
        axisRight.isEnabled = false

        val entriesMean = listOf(BarEntry(0f, meanValue.toFloat()))
        val entriesMedian = listOf(BarEntry(1f, medianValue.toFloat()))
        val entriesMin = listOf(BarEntry(2f, minValue.toFloat()))
        val entriesMax = listOf(BarEntry(3f, maxValue.toFloat()))

        val dataSetMean = BarDataSet(entriesMean, "Mean").apply {
          color = android.graphics.Color.parseColor("#4a90e2")
          setDrawValues(false)
        }
        val dataSetMedian = BarDataSet(entriesMedian, "Median").apply {
          color = android.graphics.Color.parseColor("#82ca9d")
          setDrawValues(false)
        }
        val dataSetMin = BarDataSet(entriesMin, "Min").apply {
          color = android.graphics.Color.parseColor("#ff6f61")
          setDrawValues(false)
        }
        val dataSetMax = BarDataSet(entriesMax, "Max").apply {
          color = android.graphics.Color.parseColor("#f1c40f")
          setDrawValues(false)
        }

        val barData = BarData(dataSetMean, dataSetMedian, dataSetMin, dataSetMax).apply {
          barWidth = 0.2f
        }
        data = barData

        legend.isEnabled = true
        legend.textSize = 12f

        invalidate()
      }
    }
  )
}