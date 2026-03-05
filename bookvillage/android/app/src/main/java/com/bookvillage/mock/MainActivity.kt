package com.bookvillage.mock

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    // USB real-device mode:
    // - BookVillage frontend via adb reverse: http://127.0.0.1:8080 -> host:80
    // - Admin frontend via adb reverse:       http://127.0.0.1:18080 -> host:18080
    private val bookVillageUrl = "http://127.0.0.1:8080"
    private val adminUrl = "http://127.0.0.1:18080"

    private lateinit var webView: WebView
    private lateinit var btnBookVillage: Button
    private lateinit var btnAdmin: Button

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        btnBookVillage = findViewById(R.id.btnBookVillage)
        btnAdmin = findViewById(R.id.btnAdmin)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            cacheMode = WebSettings.LOAD_NO_CACHE
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        }
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        btnBookVillage.setOnClickListener { switchSite(bookVillageUrl, isBookVillage = true) }
        btnAdmin.setOnClickListener { switchSite(adminUrl, isBookVillage = false) }

        switchSite(bookVillageUrl, isBookVillage = true)

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

    private fun switchSite(url: String, isBookVillage: Boolean) {
        btnBookVillage.isEnabled = !isBookVillage
        btnAdmin.isEnabled = isBookVillage
        webView.clearCache(true)
        webView.loadUrl(url)
    }
}
