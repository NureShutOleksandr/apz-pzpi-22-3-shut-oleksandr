package com.example.myapp

import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import java.util.*

private const val TAG = "MyApp"
private const val PREFS_NAME = "MyAppPrefs"
private const val KEY_LANGUAGE = "language"

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    // Завантажуємо збережену мову
    val sharedPrefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val savedLanguage = sharedPrefs.getString(KEY_LANGUAGE, "UA") ?: "UA"

    // Встановлюємо Locale
    val locale = if (savedLanguage == "UA") Locale("uk") else Locale("en")
    Locale.setDefault(locale)
    val config = Configuration().apply {
      setLocale(locale)
    }

    val context = createConfigurationContext(config)
    resources.updateConfiguration(config, resources.displayMetrics)
    Log.d(TAG, "Set locale before onCreate: ${locale.language}")
    Log.d(TAG, "Current app_name before onCreate: ${context.getString(R.string.app_name)}")

    super.onCreate(savedInstanceState)

    setContent {
      var language by remember { mutableStateOf(savedLanguage) }

      MyAppTheme {
        MainLayout(
          currentLanguage = language,
          onLanguageChanged = { newLanguage ->
            if (newLanguage != language) {
              language = newLanguage

              // Збереження нової мови
              with(sharedPrefs.edit()) {
                putString(KEY_LANGUAGE, newLanguage)
                apply()
              }

              // Оновлення Locale

              val newLocale = if (newLanguage == "UA") Locale("uk") else Locale("en")
              Locale.setDefault(newLocale)
              val newConfig = Configuration().apply {
                setLocale(newLocale)
              }

              val newContext = createConfigurationContext(newConfig)
              resources.updateConfiguration(newConfig, resources.displayMetrics)
              Log.d(TAG, "Applied locale: ${newLocale.language}")
              Log.d(TAG, "New app_name: ${newContext.getString(R.string.app_name)}")

              // Перезапуск активності для оновлення мови

              val intent = Intent(this@MainActivity, MainActivity::class.java)
              finish()
              startActivity(intent)
            } else {
              Log.d(TAG, "Language $newLanguage already applied, skipping")
            }
          }
        ) {
          HomeScreen()
        }
      }
    }
  }
}


@Composable
fun MyAppTheme(content: @Composable () -> Unit) {
  MaterialTheme(
    colorScheme = lightColorScheme(
      primary = Color(0xFF4a90e2),
      onPrimary = Color.White,
      surface = Color.White,
      background = Color(0xFFf5f5f5)
    ),
    typography = Typography(
      bodyMedium = TextStyle(
        fontSize = 16.sp,
        fontWeight = FontWeight.Normal
      ),
      headlineLarge = TextStyle(
        fontSize = 32.sp,
        fontWeight = FontWeight.Bold
      )
    ),
    content = content
  )
}