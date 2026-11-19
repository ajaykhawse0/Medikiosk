package com.medikiosk.exception;

import com.medikiosk.dto.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> validation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream().findFirst()
                .map(e -> e.getDefaultMessage()).orElse("Invalid request");
        return ResponseEntity.badRequest().body(ApiResponse.error(message));
    }
    @ExceptionHandler({UnauthorizedException.class, org.springframework.security.core.AuthenticationException.class})
    ResponseEntity<ApiResponse<Void>> unauthorized(Exception ex) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized")); }
    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ApiResponse<Void>> forbidden() { return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Forbidden")); }
    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiResponse<Void>> notFound(Exception ex) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage())); }
    @ExceptionHandler(DuplicateResourceException.class)
    ResponseEntity<ApiResponse<Void>> conflict(Exception ex) { return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(ex.getMessage())); }
    @ExceptionHandler({BusinessException.class, TokenExpiredException.class, ConstraintViolationException.class})
    ResponseEntity<ApiResponse<Void>> badRequest(Exception ex) { return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage())); }
    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiResponse<Void>> dataConflict(DataIntegrityViolationException ex) {
        log.error("Data integrity violation: ", ex);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error("Resource already exists or violates constraint"));
    }
    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<Void>> generic(Exception ex) {
        log.error("Unhandled exception processing request: ", ex);
        String msg = ex.getMessage() != null && !ex.getMessage().isBlank() ? ex.getMessage() : "An unexpected error occurred";
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(msg));
    }
}
