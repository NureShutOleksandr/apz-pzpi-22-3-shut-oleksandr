package com.example.myapp

import android.util.Log
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp


private const val TAG = "MyApp"

@Composable
fun LanguageToggle(currentLanguage: String, onLanguageChanged: (String) -> Unit) {
  Text(
    text = currentLanguage,
    color = Color.White,
    modifier = Modifier
      .clickable {
        val newLanguage = if (currentLanguage == "UA") "EN" else "UA"
        Log.d(TAG, "Changing language to $newLanguage")
        onLanguageChanged(newLanguage)
      }
      .padding(8.dp),
    fontSize = 16.sp
  )
}