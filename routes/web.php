<?php

use App\Http\Controllers\FakultasController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('fakultas', [FakultasController::class, 'index'])->name('fakultas');
});

require __DIR__.'/settings.php';
