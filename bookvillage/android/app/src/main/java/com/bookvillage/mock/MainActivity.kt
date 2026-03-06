package com.bookvillage.mock

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.ImageButton
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    // USB real-device mode:
    // - BookVillage frontend via adb reverse: http://127.0.0.1:8080 -> host:80
    private val bookVillageUrl = "http://127.0.0.1:8080"

    private lateinit var webView: WebView
    private lateinit var btnNavBack: ImageButton
    private lateinit var btnNavLogin: Button
    private lateinit var btnNavRegister: Button
    private lateinit var btnNavHome: ImageButton
    private lateinit var btnNavRefresh: ImageButton

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        supportActionBar?.hide()

        webView = findViewById(R.id.webView)
        btnNavBack = findViewById(R.id.btnNavBack)
        btnNavLogin = findViewById(R.id.btnNavLogin)
        btnNavRegister = findViewById(R.id.btnNavRegister)
        btnNavHome = findViewById(R.id.btnNavHome)
        btnNavRefresh = findViewById(R.id.btnNavRefresh)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            cacheMode = WebSettings.LOAD_NO_CACHE
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        }
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        btnNavBack.setOnClickListener {
            if (webView.canGoBack()) {
                webView.goBack()
            }
        }
        btnNavLogin.setOnClickListener {
            webView.loadUrl("$bookVillageUrl/login")
        }
        btnNavRegister.setOnClickListener {
            webView.loadUrl("$bookVillageUrl/register")
        }
        btnNavHome.setOnClickListener {
            webView.loadUrl(bookVillageUrl)
        }
        btnNavRefresh.setOnClickListener {
            webView.reload()
        }

        webView.clearCache(true)
        webView.loadUrl(bookVillageUrl)

        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        finish()
                    }
                }
            }
        )
    }
}
