package com.example.myapp

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
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
import com.example.myapp.api.RetrofitClient
import kotlinx.coroutines.launch

@Composable
fun DbAdminScreen(navController: NavController) {
  val coroutineScope = rememberCoroutineScope()
  var lastBackupPath by remember { mutableStateOf<String?>(null) }
  var isCreatingBackup by remember { mutableStateOf(false) }
  var isRestoringBackup by remember { mutableStateOf(false) }
  var backupName by remember { mutableStateOf("") }

  fun createBackup() = coroutineScope.launch {
    isCreatingBackup = true
    try {
      val response = RetrofitClient.apiService.createBackup()
      if (response.isSuccessful) {
        val data = response.body()
        if (data?.success == true && data.message.isNotEmpty()) {
          val path = data.message.split("\\")
          lastBackupPath = path.last()
          Log.d("DbAdmin", "Backup created: $lastBackupPath")
        } else {
          Log.e("DbAdmin", "Backup creation failed: ${response.code()}")
        }
      } else {
        Log.e("DbAdmin", "Backup creation failed: ${response.code()} - ${response.message()}")
      }
    } catch (e: Exception) {
      Log.e("DbAdmin", "Error creating backup: ${e.message}", e)
    } finally {
      isCreatingBackup = false
    }
  }

  fun restoreBackup() = coroutineScope.launch {
    if (backupName.isBlank()) {
      Log.w("DbAdmin", "Backup name is empty")
      return@launch
    }
    isRestoringBackup = true
    try {
      val response = RetrofitClient.apiService.restoreBackup(mapOf("backupName" to backupName))
      if (response.isSuccessful) {
        val data = response.body()
        if (data?.success == true) {
          Log.d("DbAdmin", "Restore successful")
        } else {
          Log.e("DbAdmin", "Restore failed: ${data?.message}")
        }
      } else {
        Log.e("DbAdmin", "Restore failed: ${response.code()} - ${response.message()}")
      }
    } catch (e: Exception) {
      Log.e("DbAdmin", "Error restoring backup: ${e.message}", e)
    } finally {
      isRestoringBackup = false
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
      text = stringResource(R.string.dbAdminDashboard_title),
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
          text = stringResource(R.string.dbAdminDashboard_createBackup),
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = Color(0xFF2c3e50)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Button(
          onClick = { createBackup() },
          enabled = !isCreatingBackup,
          modifier = Modifier.fillMaxWidth(),
          colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF4a90e2),
            contentColor = Color.White
          )
        ) {
          Text(
            text = if (isCreatingBackup) stringResource(R.string.dbAdminDashboard_creating) else stringResource(R.string.dbAdminDashboard_createBackupButton),
            fontSize = 16.sp
          )
        }
        if (lastBackupPath != null) {
          Text(
            text = stringResource(R.string.dbAdminDashboard_lastBackupPath, lastBackupPath!!),
            fontSize = 14.sp,
            color = Color(0xFF7f8c8d),
            modifier = Modifier.padding(top = 8.dp)
          )
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
          text = stringResource(R.string.dbAdminDashboard_restoreBackup),
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = Color(0xFF2c3e50)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          OutlinedTextField(
            value = backupName,
            onValueChange = { backupName = it },
            label = { Text(stringResource(R.string.dbAdminDashboard_enterBackupFolderName)) },
            modifier = Modifier.weight(1f),
            enabled = !isRestoringBackup,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text)
          )
          Button(
            onClick = { restoreBackup() },
            enabled = !isRestoringBackup,
            colors = ButtonDefaults.buttonColors(
              containerColor = Color(0xFF2ecc71),
              contentColor = Color.White
            )
          ) {
            Text(
              text = if (isRestoringBackup) stringResource(R.string.dbAdminDashboard_restoring) else stringResource(R.string.dbAdminDashboard_restoreButton),
              fontSize = 16.sp
            )
          }
        }
      }
    }
  }
}