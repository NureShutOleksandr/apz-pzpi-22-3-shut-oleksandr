package com.example.myapp

import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.myapp.data.Room
import java.util.Locale

@Composable
fun HomeScreen(
  rooms: List<Room>?,
  onRoomClick: (String) -> Unit,
  onCreateRoom: (String, Double, Double, Double, Double) -> Unit,
  onDeleteRoom: (String) -> Unit,
  navController: NavController,
  isDatabaseAdmin: Boolean,
  isAuth: Boolean,
  onRoomsUpdated: () -> Unit
) {
  val context = LocalContext.current
  val locale = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
    context.resources.configuration.locales[0]
  } else {
    context.resources.configuration.locale
  }

  var showDialog by remember { mutableStateOf(false) }
  var roomName by remember { mutableStateOf("") }
  var temperature by remember { mutableStateOf("") }
  var moisture by remember { mutableStateOf("") }
  var carbonDioxide by remember { mutableStateOf("") }
  var illumination by remember { mutableStateOf("") }

  if (showDialog) {
    AlertDialog(
      onDismissRequest = { showDialog = false },
      title = { Text(text = stringResource(R.string.create_new_room)) },
      text = {
        Column {
          OutlinedTextField(
            value = roomName,
            onValueChange = { roomName = it },
            label = { Text(stringResource(R.string.room_name)) },
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(8.dp))
          OutlinedTextField(
            value = temperature,
            onValueChange = { temperature = it },
            label = { Text(stringResource(R.string.temperature_celsius)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(8.dp))
          OutlinedTextField(
            value = moisture,
            onValueChange = { moisture = it },
            label = { Text(stringResource(R.string.moisture_percent)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(8.dp))
          OutlinedTextField(
            value = carbonDioxide,
            onValueChange = { carbonDioxide = it },
            label = { Text(stringResource(R.string.co2_ppm)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(8.dp))
          OutlinedTextField(
            value = illumination,
            onValueChange = { illumination = it },
            label = { Text(stringResource(R.string.illumination_lux)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.fillMaxWidth()
          )
        }
      },
      confirmButton = {
        TextButton(
          onClick = {
            val temp = temperature.toDoubleOrNull() ?: 0.0
            val moist = moisture.toDoubleOrNull() ?: 0.0
            val co2 = carbonDioxide.toDoubleOrNull() ?: 0.0
            val illum = illumination.toDoubleOrNull() ?: 0.0
            if (roomName.isNotBlank()) {
              onCreateRoom(roomName, temp, moist, co2, illum)
              showDialog = false
              roomName = ""
              temperature = ""
              moisture = ""
              carbonDioxide = ""
              illumination = ""
            }
          }
        ) {
          Text(stringResource(R.string.create))
        }
      },
      dismissButton = {
        TextButton(onClick = { showDialog = false }) {
          Text(stringResource(R.string.cancel))
        }
      }
    )
  }

  LazyColumn(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFFf5f5f5))
      .padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
    horizontalAlignment = Alignment.CenterHorizontally
  ) {
    // Кнопка створення кімнати
    if (isAuth) {
      item {
        Surface(
          modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight(),
          shape = RoundedCornerShape(12.dp),
          shadowElevation = 6.dp,
          color = Color(0xFF2c3e50)
        ) {
          Button(
            onClick = { showDialog = true },
            modifier = Modifier
              .fillMaxWidth()
              .padding(16.dp),
            colors = ButtonDefaults.buttonColors(
              containerColor = Color(0xFF2c3e50),
              contentColor = Color.White
            )
          ) {
            Text(
              text = stringResource(R.string.create_room),
              fontSize = 18.sp,
              fontWeight = FontWeight.Bold
            )
          }
        }
      }
    }

    // Кнопка адміна (якщо роль DATABASE_ADMIN)
    if (isDatabaseAdmin) {
      item {
        Surface(
          modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight(),
          shape = RoundedCornerShape(12.dp),
          shadowElevation = 6.dp,
          color = Color(0xFF3498db)
        ) {
          Button(
            onClick = { navController.navigate("dbAdmin") },
            modifier = Modifier
              .fillMaxWidth()
              .padding(16.dp),
            colors = ButtonDefaults.buttonColors(
              containerColor = Color(0xFF3498db),
              contentColor = Color.White
            )
          ) {
            Text(
              text = stringResource(R.string.admin),
              fontSize = 18.sp,
              fontWeight = FontWeight.Bold
            )
          }
        }
      }
    }

    // Привітальна секція
    item {
      Surface(
        modifier = Modifier
          .fillMaxWidth()
          .wrapContentHeight(),
        shape = RoundedCornerShape(12.dp),
        shadowElevation = 6.dp,
        color = Color.White
      ) {
        Column(
          modifier = Modifier
            .padding(32.dp)
            .fillMaxWidth(),
          horizontalAlignment = Alignment.CenterHorizontally,
          verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
          Text(
            text = stringResource(R.string.welcome_title),
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF2c3e50),
            textAlign = TextAlign.Center
          )
          Text(
            text = stringResource(R.string.description),
            fontSize = 16.sp,
            color = Color(0xFF7f8c8d),
            textAlign = TextAlign.Center,
            lineHeight = 24.sp
          )
        }
      }
    }

    // Список кімнат
    if (rooms.isNullOrEmpty()) {
      item {
        Text(
          text = stringResource(R.string.no_rooms_available),
          fontSize = 18.sp,
          color = Color(0xFF1e1e1e),
          textAlign = TextAlign.Center
        )
      }
    } else {
      items(rooms.reversed()) { room ->
        Surface(
          modifier = Modifier
            .fillMaxWidth()
            .clickable { onRoomClick(room._id) },
          shape = RoundedCornerShape(8.dp),
          shadowElevation = 4.dp,
          color = Color.White
        ) {
          Row(
            modifier = Modifier
              .padding(16.dp)
              .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Column(
              modifier = Modifier.weight(1f),
              verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              Text(
                text = room.roomName,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1e1e1e)
              )
              Text(
                text = stringResource(
                  R.string.room_temperature,
                  convertTemperatureIfNeeded(room.temperature, locale)
                ),
                fontSize = 16.sp,
                color = Color(0xFF7f8c8d)
              )
              Text(
                text = stringResource(R.string.room_moisture, room.moisture),
                fontSize = 16.sp,
                color = Color(0xFF7f8c8d)
              )
              Text(
                text = stringResource(R.string.room_co2, room.carbonDioxide),
                fontSize = 16.sp,
                color = Color(0xFF7f8c8d)
              )
              Text(
                text = stringResource(R.string.room_illumination, room.illumination),
                fontSize = 16.sp,
                color = Color(0xFF7f8c8d)
              )
            }
            // Кнопка видалення
            Button(
              onClick = { onDeleteRoom(room._id) },
              colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFFe74c3c),
                contentColor = Color.White
              ),
              modifier = Modifier.padding(start = 8.dp)
            ) {
              Text(
                text = stringResource(R.string.delete),
                fontSize = 14.sp
              )
            }
          }
        }
      }
    }
  }
}

fun convertTemperatureIfNeeded(celsius: Double, locale: Locale): String {
  return if (locale.language == "en") {
    val fahrenheit = (celsius * 9 / 5) + 32
    "%.1f°F".format(fahrenheit)
  } else {
    "%.1f°C".format(celsius)
  }
}