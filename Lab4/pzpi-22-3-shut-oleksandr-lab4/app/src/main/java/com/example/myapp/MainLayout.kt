package com.example.myapp

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material3.TopAppBar


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainLayout(
  currentLanguage: String,
  onLanguageChanged: (String) -> Unit,
  content: @Composable () -> Unit
) {
  var isAuth by remember { mutableStateOf(false) }
  var username by remember { mutableStateOf<String?>(null) }

  Scaffold(
    topBar = {
      TopAppBar(
        title = {
          Text(
            text = stringResource(R.string.app_name),
            modifier = Modifier,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
          )
        },
        actions = {
          Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            if (isAuth) {
              username?.let {
                Text(
                  text = it,
                  color = Color(0xFFcfcfcf),
                  fontWeight = FontWeight.SemiBold,
                  fontSize = 16.sp,
                  modifier = Modifier.padding(8.dp)
                )
              }
              Button(
                onClick = {
                  isAuth = false
                  username = null
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFff5252)),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.padding(8.dp)
              ) {
                Text(
                  text = stringResource(R.string.logout),
                  color = Color.White,
                  fontWeight = FontWeight.Medium
                )
              }
            } else {
              Text(
                text = stringResource(R.string.login),
                color = Color.White,
                modifier = Modifier
                    .clickable {
                        isAuth = true
                        username = "TestUser"
                    }
                    .padding(8.dp),
                fontSize = 16.sp
              )
              Text(
                text = stringResource(R.string.sign_up),
                color = Color.White,
                modifier = Modifier
                    .clickable { /* Поки нічого */ }
                    .padding(8.dp),
                fontSize = 16.sp
              )
            }
            LanguageToggle(
              currentLanguage = currentLanguage,
              onLanguageChanged = onLanguageChanged
            )
          }
        },
        colors = TopAppBarDefaults.topAppBarColors(
          containerColor = Color(0xFF1e1e1e),
          titleContentColor = Color.White
        )
      )
    },
    content = { padding ->
      Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFf5f5f5))
            .padding(padding)
      ) {
        content()
      }
    }
  )
}