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
import com.example.myapp.api.RetrofitClient
import com.example.myapp.data.CreateUserDto
import com.example.myapp.data.CreateRoomDto
import com.example.myapp.data.Room
import com.example.myapp.data.RoomAnalysis
import java.util.*
import com.example.myapp.api.RetrofitClient.updateAccessToken
import kotlinx.coroutines.launch

private const val TAG = "MyApp"
private const val PREFS_NAME = "MyAppPrefs"
private const val KEY_LANGUAGE = "language"
private const val KEY_IS_AUTH = "is_auth"
private const val KEY_USERNAME = "username"
private const val KEY_ACCESS_TOKEN = "access_token"
private const val KEY_USER_ID = "user_id"
private const val KEY_ROLE = "role"

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    val sharedPrefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    val savedLanguage = sharedPrefs.getString(KEY_LANGUAGE, "UA") ?: "UA"
    val isAuth = sharedPrefs.getBoolean(KEY_IS_AUTH, false)
    val username = sharedPrefs.getString(KEY_USERNAME, null)
    val accessToken = sharedPrefs.getString(KEY_ACCESS_TOKEN, null)
    val userId = sharedPrefs.getString(KEY_USER_ID, null)
    val role = sharedPrefs.getString(KEY_ROLE, null)

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
      var currentAccessToken by remember { mutableStateOf(accessToken) }
      var currentUserId by remember { mutableStateOf(userId) }
      var currentRole by remember { mutableStateOf(role) }
      var rooms by remember { mutableStateOf<List<Room>?>(null) }

      LaunchedEffect(currentAccessToken) {
        updateAccessToken(currentAccessToken)
      }

      // Отримуємо userId та роль після логіну
      LaunchedEffect(authState, currentUsername) {
        if (currentUsername != null) {
          try {
            val response = RetrofitClient.apiService.findUserByUsername(currentUsername!!)
            if (response.isSuccessful) {
              val userResponse = response.body()
              if (userResponse != null) {
                currentUserId = userResponse._id
                currentRole = userResponse.roles[0].value
                with(sharedPrefs.edit()) {
                  putString(KEY_USER_ID, userResponse._id)
                  putString(KEY_ROLE, userResponse.roles[0].value)
                  apply()
                }
                Log.d(TAG, "User ID loaded: ${userResponse._id}, Role: ${userResponse.roles[0].value}")
              } else {
                Log.d(TAG, "User response body is null")
              }
            } else {
              Log.d(TAG, "Failed to find user: ${response.code()} - ${response.message()}")
            }
          } catch (e: Exception) {
            Log.e(TAG, "Error finding user: ${e.message}", e)
          }
        }
      }

      // Завантажуємо кімнати
      LaunchedEffect(authState, currentUserId) {
        if (authState && currentUserId != null) {
          try {
            val response = RetrofitClient.apiService.getRooms(currentUserId!!)
            if (response.isSuccessful) {
              rooms = response.body()
              Log.d(TAG, "Rooms loaded: ${rooms?.size}")
            } else {
              Log.d(TAG, "Failed to load rooms: ${response.code()} - ${response.message()}")
            }
          } catch (e: Exception) {
            Log.e(TAG, "Error loading rooms: ${e.message}", e)
          }
        }
      }

      val navController = rememberNavController()
      val coroutineScope = rememberCoroutineScope()

      // Функція для оновлення кімнат
      val refreshRooms: () -> Unit = {
        coroutineScope.launch {
          if (authState && currentUserId != null) {
            try {
              val response = RetrofitClient.apiService.getRooms(currentUserId!!)
              if (response.isSuccessful) {
                rooms = response.body()
                Log.d(TAG, "Rooms refreshed: ${rooms?.size}")
              } else {
                Log.e(TAG, "Failed to refresh rooms: ${response.code()} - ${response.message()}")
              }
            } catch (e: Exception) {
              Log.e(TAG, "Error refreshing rooms: ${e.message}", e)
            }
          }
        }
      }

      // Функція для аналізу кімнати
      val onAnalyze: suspend (String) -> RoomAnalysis? = { roomId ->
        try {
          val response = RetrofitClient.apiService.analyzeRoom(roomId)
          if (response.isSuccessful) {
            response.body()
          } else {
            Log.e(TAG, "Failed to analyze room: ${response.code()} - ${response.message()}")
            null
          }
        } catch (e: Exception) {
          Log.e(TAG, "Error analyzing room: ${e.message}", e)
          null
        }
      }

      // Функція для створення кімнати
      val onCreateRoom: (String, Double, Double, Double, Double) -> Unit = { roomName, temp, moist, co2, illum ->
        coroutineScope.launch {
          if (currentUserId == null) {
            Log.e(TAG, "Cannot create room: userId is null")
            return@launch
          }
          try {
            val roomData = CreateRoomDto(
              user = currentUserId!!,
              roomName = roomName,
              temperature = temp,
              moisture = moist,
              carbonDioxide = co2,
              illumination = illum
            )
            val response = RetrofitClient.apiService.createRoom(roomData)
            if (response.isSuccessful) {
              val newRoom = response.body()
              if (newRoom != null) {
                rooms = rooms?.plus(newRoom) ?: listOf(newRoom)
                Log.d(TAG, "Room created: ${newRoom.roomName}")
              } else {
                Log.e(TAG, "Failed to create room: response body is null")
              }
            } else {
              Log.e(TAG, "Failed to create room: ${response.code()} - ${response.message()}")
            }
          } catch (e: Exception) {
            Log.e(TAG, "Error creating room: ${e.message}", e)
          }
        }
      }

      // Функція для видалення кімнати
      val onDeleteRoom: (String) -> Unit = { roomId ->
        coroutineScope.launch {
          try {
            val response = RetrofitClient.apiService.deleteRoom(roomId)
            if (response.isSuccessful) {
              rooms = rooms?.filter { it._id != roomId }
              Log.d(TAG, "Room deleted: $roomId")
            } else {
              Log.e(TAG, "Failed to delete room: ${response.code()} - ${response.message()}")
            }
          } catch (e: Exception) {
            Log.e(TAG, "Error deleting room: ${e.message}", e)
          }
        }
      }

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
                  putString(KEY_ACCESS_TOKEN, null)
                  putString(KEY_ROLE, null)
                  apply()
                }
                authState = false
                currentUsername = null
                currentAccessToken = null
                currentRole = null
                rooms = null
                updateAccessToken(null)
              }
            ) {
              HomeScreen(
                rooms = rooms,
                onRoomClick = { roomId ->
                  navController.navigate("room/$roomId")
                },
                onCreateRoom = onCreateRoom,
                onDeleteRoom = onDeleteRoom,
                navController = navController,
                isDatabaseAdmin = currentRole == "DATABASE_ADMIN",
                isSystemAdmin = currentRole == "SYSTEM_ADMIN",
                isPlatformAdmin = currentRole == "PLATFORM_ADMIN",
                isAuth = authState,
                onRoomsUpdated = refreshRooms
              )
            }
          }
          composable("login") {
            LoginScreen(
              onLogin = { username, password ->
                try {
                  val response = RetrofitClient.apiService.login(
                    CreateUserDto(username, password)
                  )
                  if (response.isSuccessful) {
                    val loginResponse = response.body()
                    if (loginResponse != null) {
                      val token = loginResponse.token.accessToken
                      with(sharedPrefs.edit()) {
                        putBoolean(KEY_IS_AUTH, true)
                        putString(KEY_USERNAME, username)
                        putString(KEY_ACCESS_TOKEN, token)
                        apply()
                      }
                      authState = true
                      currentUsername = username
                      currentAccessToken = token
                      updateAccessToken(token)
                      Log.d(TAG, "Login successful, token: $token")
                      true
                    } else {
                      Log.d(TAG, "Login failed: response body is null")
                      false
                    }
                  } else {
                    Log.d(TAG, "Login failed: ${response.code()} - ${response.message()}")
                    false
                  }
                } catch (e: Exception) {
                  Log.e(TAG, "Login error: ${e.message}", e)
                  false
                }
              },
              onNavigateBack = { navController.popBackStack() }
            )
          }
          composable("signup") {
            SignUpScreen(
              onSignUp = { username, password, confirmPassword ->
                try {
                  if (password != confirmPassword) {
                    Log.d(TAG, "Signup failed: passwords do not match")
                    return@SignUpScreen false
                  }
                  val response = RetrofitClient.apiService.register(
                    CreateUserDto(username, password)
                  )
                  if (response.isSuccessful) {
                    val registerResponse = response.body()
                    if (registerResponse != null) {
                      val token = registerResponse.token.accessToken
                      with(sharedPrefs.edit()) {
                        putBoolean(KEY_IS_AUTH, true)
                        putString(KEY_USERNAME, username)
                        putString(KEY_ACCESS_TOKEN, token)
                        apply()
                      }
                      authState = true
                      currentUsername = username
                      currentAccessToken = token
                      updateAccessToken(token)
                      Log.d(TAG, "Signup successful, token: $token")
                      true
                    } else {
                      Log.d(TAG, "Signup failed: response body is null")
                      false
                    }
                  } else {
                    Log.d(TAG, "Signup failed: ${response.code()} - ${response.message()}")
                    false
                  }
                } catch (e: Exception) {
                  Log.e(TAG, "Signup error: ${e.message}", e)
                  false
                }
              },
              onNavigateBack = { navController.popBackStack() }
            )
          }
          composable("room/{roomId}") { backStackEntry ->
            val roomId = backStackEntry.arguments?.getString("roomId") ?: return@composable
            val room = rooms?.find { it._id == roomId }
            if (room == null) {
              Log.e(TAG, "Room with id $roomId not found")
              navController.popBackStack()
              return@composable
            }
            RoomScreen(
              room = room,
              onAnalyze = onAnalyze,
              onNavigateBack = { navController.popBackStack() }
            )
          }
          composable("dbAdmin") {
            DbAdminScreen(
              navController = navController,
              onRoomsUpdated = refreshRooms
            )
          }
          composable("systemAdmin") {
            SystemAdminScreen(navController = navController)
          }
          composable("platformAdmin") {
            PlatformAdminScreen(navController = navController)
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