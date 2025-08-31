# CORS Configuration Guide

The React frontend is experiencing CORS (Cross-Origin Resource Sharing) issues when trying to communicate with the Java backend. This is because the frontend (http://localhost:3000) and backend (http://localhost:8081) are running on different ports.

## Backend CORS Configuration (Java/Spring)

Add the following to your Java backend to enable CORS:

### Option 1: Spring Boot @CrossOrigin Annotation

```java
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api")
public class AuthController {
    // Your controller methods
}
```

### Option 2: Global CORS Configuration

Create a configuration class:

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Option 3: Filter-based CORS (for non-Spring applications)

```java
@Component
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }
}
```

## Frontend Proxy Configuration (Alternative Solution)

If you cannot modify the backend, you can use the React development proxy:

### Update package.json:
```json
{
  "name": "pahana-bookshop-frontend",
  "proxy": "http://localhost:8081",
  // ... rest of package.json
}
```

### Then update API base URL in constants.js:
```javascript
export const API_BASE_URL = '/Mega_City_Cab_Service_App_war_exploded';
```

## Testing CORS Configuration

1. Start your backend server on port 8081
2. Ensure the CORS configuration is applied
3. Restart the React development server
4. Try logging in with demo credentials: admin/password

## Common CORS Issues

1. **Preflight Requests**: Modern browsers send OPTIONS requests before actual requests
2. **Credentials**: Ensure `allowCredentials: true` is set for session-based auth
3. **Headers**: Allow necessary headers like Authorization, Content-Type
4. **Methods**: Allow all HTTP methods your API uses (GET, POST, PUT, DELETE, OPTIONS)

## Production Considerations

For production deployment:
- Update allowed origins to your production domain
- Consider using environment variables for origin configuration
- Implement proper security headers
- Use HTTPS for secure cookie transmission