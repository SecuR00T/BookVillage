package com.bookvillage.mock.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * React SPA ??뺥뒅: frontend ??슢諭?野껉퀗?든몴?src/main/resources/static??癰귣벊沅??롢늺
 * API揶쎛 ?袁⑤빒 筌뤴뫀諭?野껋럥以?癒?퐣 index.html 獄쏆꼹??(?????곷섧????깆뒭??
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new ResourceResolver() {
                    @Override
                    public Resource resolveResource(HttpServletRequest request, String requestPath,
                            List<? extends Resource> locations, ResourceResolverChain chain) {
                        Resource resolved = chain.resolveResource(request, requestPath, locations);
                        if (resolved != null) return resolved;
                        if (!requestPath.startsWith("api")) {
                            return new ClassPathResource("/static/index.html");
                        }
                        return null;
                    }
                    @Override
                    public String resolveUrlPath(String resourcePath, List<? extends Resource> locations,
                            ResourceResolverChain chain) {
                        return chain.resolveUrlPath(resourcePath, locations);
                    }
                });
    }
}
