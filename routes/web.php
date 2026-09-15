<?php

use App\Http\Controllers\FakultasController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
    Route::get('fakultas', [FakultasController::class, 'index'])->name('fakultas.index');
    Route::post('fakultas/store', [FakultasController::class, 'store'])->name('fakultas.store');
    Route::put('fakultas/{id}', [FakultasController::class, 'update'])->name('fakultas.update');
    Route::delete('fakultas/{id}', [FakultasController::class, 'destroy'])->name('fakultas.destroy');
});

require __DIR__.'/settings.php';
