package com.medikiosk.exception;
public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String message) { super(message); }
}
