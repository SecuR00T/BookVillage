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

    // 개발: "http://10.0.2.2:3000" (에뮬레이터 -> localhost)
    // 개발: "http://YOUR_PC_IP:3000" (실기기)
    // 배포: "https://your-domain.com"
    private val webAppUrl = "http://10.0.2.2:3000"

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
