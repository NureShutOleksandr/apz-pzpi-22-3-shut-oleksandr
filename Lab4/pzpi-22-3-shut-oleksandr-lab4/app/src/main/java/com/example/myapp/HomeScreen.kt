package com.example.myapp

import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.myapp.data.Room
import java.util.Locale

@Composable
fun HomeScreen(
  rooms: List<Room>?,
  onRoomClick: (String) -> Unit,
  onCreateRoom: (String) -> Unit, // Нова функція для створення кімнати
  onDeleteRoom: (String) -> Unit // Нова функція для видалення кімнати
) {
  val context = LocalContext.current
  val locale = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
    context.resources.configuration.locales[0]
  } else {
    context.resources.configuration.locale
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
          onClick = {
            // Викликаємо функцію створення кімнати з назвою за замовчуванням
            onCreateRoom("New Room")
          },
          modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
          colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF2c3e50),
            contentColor = Color.White
          )
        ) {
          Text(
            text = "Create Room",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
          )
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
      items(rooms) { room ->
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
                text = "Delete",
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