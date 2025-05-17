package com.example.myapp

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.compose.foundation.rememberScrollState
import com.example.myapp.api.RetrofitClient
import com.example.myapp.data.ConfigRule
import com.example.myapp.data.ImportConfigRes
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.decodeFromJsonElement

@Composable
fun SystemAdminScreen(navController: NavController) {
  val coroutineScope = rememberCoroutineScope()
  var lastExportedConfig by remember { mutableStateOf<List<ConfigRule>?>(null) }
  var isExporting by remember { mutableStateOf(false) }
  var isImporting by remember { mutableStateOf(false) }
  var importConfigData by remember { mutableStateOf("") }

  // Default config
  val defaultConfig = listOf(
    ConfigRule("temperature_mean", ">", 25.0, "Temperature is higher than normal"),
    ConfigRule("temperature_mean", "<", 18.0, "Temperature is lower than normal"),
    ConfigRule("moisture_mean", "<", 30.0, "Moisture level is critically low"),
    ConfigRule("moisture_mean", ">", 60.0, "Moisture level is too high"),
    ConfigRule("carbonDioxide_mean", ">", 1000.0, "CO2 concentration is dangerously high"),
    ConfigRule("carbonDioxide_mean", "<", 400.0, "CO2 concentration is unusually low"),
    ConfigRule("illumination_mean", "<", 200.0, "Room is poorly illuminated"),
    ConfigRule("illumination_mean", ">", 800.0, "Room is over-illuminated")
  )

  LaunchedEffect(Unit) {
    importConfigData = Json.encodeToString(defaultConfig)
  }

  fun exportConfig() = coroutineScope.launch {
    isExporting = true
    try {
      val response = RetrofitClient.apiService.exportConfig()
      if (response.isSuccessful) {
        val data = response.body()
        if (data != null) {
          lastExportedConfig = data
          Log.d("SystemAdmin", "Config exported: $data")
        } else {
          Log.e("SystemAdmin", "Export config failed: response body is null")
        }
      } else {
        Log.e("SystemAdmin", "Export config failed: ${response.code()} - ${response.message()}")
      }
    } catch (e: Exception) {
      Log.e("SystemAdmin", "Error exporting config: ${e.message}", e)
    } finally {
      isExporting = false
    }
  }

  fun importConfig() = coroutineScope.launch {
    if (importConfigData.isBlank()) {
      Log.w("SystemAdmin", "Import config data is empty")
      return@launch
    }
    isImporting = true
    try {
      val jsonArray = Json.parseToJsonElement(importConfigData) as? JsonArray
        ?: throw IllegalArgumentException("Invalid JSON format: expected an array")

      val config = jsonArray.map { element ->
        val obj = element as? JsonObject
          ?: throw IllegalArgumentException("Invalid JSON format: expected an object")
        Json.decodeFromJsonElement<ConfigRule>(obj)
      }

      val response = RetrofitClient.apiService.importConfig(config)
      if (response.isSuccessful) {
        val data = response.body()
        if (data != null) {
          lastExportedConfig = config
          Log.d("SystemAdmin", "Config imported successfully: ${data.message}")
        } else {
          Log.e("SystemAdmin", "Import config failed: response body is null")
        }
      } else {
        Log.e("SystemAdmin", "Import config failed: ${response.code()} - ${response.message()}")
      }
    } catch (e: Exception) {
      Log.e("SystemAdmin", "Error importing config: ${e.message}", e)
    } finally {
      isImporting = false
    }
  }

  Column(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFFf5f5f5))
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
    horizontalAlignment = Alignment.CenterHorizontally
  ) {
    Text(
      text = stringResource(R.string.systemAdminDashboard_title),
      fontSize = 28.sp,
      fontWeight = FontWeight.Bold,
      color = Color(0xFF2c3e50),
      textAlign = TextAlign.Center
    )

    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .wrapContentHeight(),
      shape = RoundedCornerShape(12.dp),
      shadowElevation = 6.dp,
      color = Color.White
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        Text(
          text = stringResource(R.string.systemAdminDashboard_exportConfiguration),
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = Color(0xFF2c3e50)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Button(
          onClick = { exportConfig() },
          enabled = !isExporting,
          modifier = Modifier.fillMaxWidth(),
          colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF4a90e2),
            contentColor = Color.White
          )
        ) {
          Text(
            text = if (isExporting) stringResource(R.string.systemAdminDashboard_exporting) else stringResource(
              R.string.systemAdminDashboard_exportButton
            ),
            fontSize = 16.sp
          )
        }
        if (lastExportedConfig != null) {
          Text(
            text = stringResource(R.string.systemAdminDashboard_lastExportedConfig),
            fontSize = 14.sp,
            color = Color(0xFF7f8c8d),
            modifier = Modifier.padding(top = 8.dp)
          )
          val scrollState = rememberScrollState()
          Column(
            modifier = Modifier
              .background(Color(0xFFf9f9f9))
              .padding(8.dp)
              .fillMaxWidth()
              .heightIn(max = 200.dp)
              .verticalScroll(scrollState)
          ) {
            Text(
              text = Json.encodeToString(lastExportedConfig),
              fontSize = 12.sp,
              color = Color(0xFF2c3e50)
            )
          }
        }
      }
    }

    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .wrapContentHeight(),
      shape = RoundedCornerShape(12.dp),
      shadowElevation = 6.dp,
      color = Color.White
    ) {
      Column(modifier = Modifier.padding(16.dp)) {
        Text(
          text = stringResource(R.string.systemAdminDashboard_importConfiguration),
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = Color(0xFF2c3e50)
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
          value = importConfigData,
          onValueChange = { importConfigData = it },
          label = { Text(stringResource(R.string.systemAdminDashboard_pasteConfigJson)) },
          modifier = Modifier
            .fillMaxWidth()
            .height(150.dp),
          enabled = !isImporting,
          keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Button(
          onClick = { importConfig() },
          enabled = !isImporting,
          modifier = Modifier.fillMaxWidth(),
          colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF2ecc71),
            contentColor = Color.White
          )
        ) {
          Text(
            text = if (isImporting) stringResource(R.string.systemAdminDashboard_importing) else stringResource(
              R.string.systemAdminDashboard_importButton
            ),
            fontSize = 16.sp
          )
        }
      }
    }
  }
}