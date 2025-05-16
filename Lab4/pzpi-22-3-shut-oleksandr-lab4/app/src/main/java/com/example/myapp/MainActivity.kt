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
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import java.util.*

private const val TAG = "MyApp"
private const val PREFS_NAME = "MyAppPrefs"
private const val KEY_LANGUAGE = "language"
private const val KEY_IS_AUTH = "is_auth"
private const val KEY_USERNAME = "username"

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    // Завантажуємо збережену мову та стан автентифікації
    val sharedPrefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val savedLanguage = sharedPrefs.getString(KEY_LANGUAGE, "UA") ?: "UA"
    val isAuth = sharedPrefs.getBoolean(KEY_IS_AUTH, false)
    val username = sharedPrefs.getString(KEY_USERNAME, null)

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
      var authState by remember { mutableStateOf(isAuth) }
      var currentUsername by remember { mutableStateOf(username) }

      val navController = rememberNavController()

      MyAppTheme {
        NavHost(
          navController = navController,
          startDestination = "home"
        ) {
          composable("home") {
            MainLayout(
              currentLanguage = language,
              onLanguageChanged = { newLanguage ->
                if (newLanguage != language) {
                  language = newLanguage
                  with(sharedPrefs.edit()) {
                    putString(KEY_LANGUAGE, newLanguage)
                    apply()
                  }
                  val newLocale = if (newLanguage == "UA") Locale("uk") else Locale("en")
                  Locale.setDefault(newLocale)
                  val newConfig = Configuration().apply {
                    setLocale(newLocale)
                  }
                  val newContext = createConfigurationContext(newConfig)
                  resources.updateConfiguration(newConfig, resources.displayMetrics)
                  Log.d(TAG, "Applied locale: ${newLocale.language}")
                  Log.d(TAG, "New app_name: ${newContext.getString(R.string.app_name)}")
                  val intent = Intent(this@MainActivity, MainActivity::class.java)
                  finish()
                  startActivity(intent)
                } else {
                  Log.d(TAG, "Language $newLanguage already applied, skipping")
                }
              },
              isAuth = authState,
              username = currentUsername,
              onLoginClick = { navController.navigate("login") },
              onSignUpClick = { navController.navigate("signup") },
              onLogoutClick = {
                with(sharedPrefs.edit()) {
                  putBoolean(KEY_IS_AUTH, false)
                  putString(KEY_USERNAME, null)
                  apply()
                }
                authState = false
                currentUsername = null
              }
            ) {
              HomeScreen()
            }
          }
          composable("login") {
            LoginScreen(
              onLogin = { username, password ->
                // Тимчасова логіка: логін успішний, якщо пароль "test"
                val success = password == "test"
                if (success) {
                  with(sharedPrefs.edit()) {
                    putBoolean(KEY_IS_AUTH, true)
                    putString(KEY_USERNAME, username)
                    apply()
                  }
                  authState = true
                  currentUsername = username
                }
                success
              },
              onNavigateBack = { navController.popBackStack() }
            )
          }
          composable("signup") {
            SignUpScreen(
              onSignUp = { username, password, confirmPassword ->
                // Тимчасова логіка: реєстрація успішна, якщо паролі збігаються
                val success = password == confirmPassword && password.isNotEmpty()
                if (success) {
                  with(sharedPrefs.edit()) {
                    putBoolean(KEY_IS_AUTH, true)
                    putString(KEY_USERNAME, username)
                    apply()
                  }
                  authState = true
                  currentUsername = username
                }
                success
              },
              onNavigateBack = { navController.popBackStack() }
            )
          }
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