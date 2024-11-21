<?php

use App\Http\Controllers\AmbientesController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ReservasController;
use App\Http\Controllers\UsuariosController;
use App\Http\Middleware\JsonRequestMiddleware;
use Illuminate\Support\Facades\Route;

Route::post('login', [LoginController::class, 'login'])->name('login');

Route::middleware(['auth:sanctum', JsonRequestMiddleware::class])->group(function () {
    Route::apiResource('usuarios', UsuariosController::class);
    Route::apiResource('ambientes', AmbientesController::class);
    Route::apiResource('reservas', ReservasController::class);
});
