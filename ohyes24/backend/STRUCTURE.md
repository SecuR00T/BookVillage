# Backend Structure Guide

Code is organized by **layer + feature** to make code reviews easier.

## Root
- `src/main/java/com/yes24/mock/Yes24MockApplication.java`

## Common
- `common/config`: framework config
- `common/util`: shared utility code

## Controllers
- `controller/admin`
- `controller/auth`
- `controller/board`
- `controller/books`
- `controller/cart`
- `controller/files`
- `controller/integration`
- `controller/labs`
- `controller/mypage`
- `controller/orders`
- `controller/reviews`
- `controller/support`
- `controller/system`
- `controller/users`

## Services
- `service/admin`
- `service/auth`
- `service/board`
- `service/books`
- `service/files`
- `service/labs`
- `service/orders`
- `service/reviews`
- `service/support`
- `service/users`

## DTOs
- `dto/admin`
- `dto/auth`
- `dto/board`
- `dto/books`
- `dto/cart`
- `dto/integration`
- `dto/labs`
- `dto/orders`
- `dto/reviews`
- `dto/support`
- `dto/users`

## Entities
- `entity/admin`
- `entity/board`
- `entity/books`
- `entity/orders`
- `entity/reviews`
- `entity/support`
- `entity/users`

## Repositories
- `repository/admin`
- `repository/board`
- `repository/books`
- `repository/orders`
- `repository/reviews`
- `repository/support`
- `repository/users`

## Security
- `security/users`
