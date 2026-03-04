package com.yes24.mock

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

/**
 * YES24 모형 - Android WebView
 * React 프론트엔드를 로드하여 모바일 앱처럼 사용
 * 보안 교육 및 모의해킹 테스트용
 */
class MainActivity : AppCompatActivity() {

    // URL은 gradle.properties의 webAppUrl 또는 -PwebAppUrl로 주입됨.
    private val webAppUrl = BuildConfig.WEB_APP_URL

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.webView)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            cacheMode = WebSettings.CACHE_MODE_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        }
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
        webView.loadUrl(webAppUrl)
    }
}
