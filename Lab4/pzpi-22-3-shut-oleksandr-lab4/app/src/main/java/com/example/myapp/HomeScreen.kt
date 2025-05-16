package com.example.myapp

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun HomeScreen() {
  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFFf5f5f5))
      .padding(16.dp),
    contentAlignment = Alignment.Center
  ) {
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
        verticalArrangement = Arrangement.spacedBy(
          16

            .dp
        )
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
        Row(
          horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
          Button(
            onClick = { /* Поки нічого не робить */ },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4a90e2)),
            shape = RoundedCornerShape(8.dp)
          ) {
            Text(
              text = stringResource(R.string.rooms_button),
              color = Color.White,
              fontWeight = FontWeight.Medium
            )
          }
        }
      }
    }
  }
}
