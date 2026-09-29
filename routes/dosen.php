<?php

use App\Http\Controllers\Dosen\DashboardController;
use App\Http\Controllers\Dosen\HkiController;
use App\Http\Controllers\Dosen\KegiatanController;
use App\Http\Controllers\Dosen\PkmController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:dosen'])
    ->prefix('dosen')
    ->name('dosen.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('kegiatan', [KegiatanController::class, 'index'])->name('kegiatan.index');
        Route::get('kegiatan/create', [KegiatanController::class, 'create'])->name('kegiatan.create');
        Route::post('kegiatan/create', [KegiatanController::class, 'store'])->name('kegiatan.store');
        Route::get('kegiatan//detail/{id}', [KegiatanController::class, 'show'])->name('kegiatan.show');
        Route::get('kegiatan/{id}', [KegiatanController::class, 'edit'])->name('kegiatan.edit');
        Route::put('kegiatan/{id}', [KegiatanController::class, 'update'])->name('kegiatan.update');
        Route::delete('kegiatan/{id}', [KegiatanController::class, 'destroy'])->name('kegiatan.destroy');

        Route::get('pkm', [PkmController::class, 'index'])->name('pkm.index');
        Route::get('pkm/create', [PkmController::class, 'create'])->name('pkm.create');
        Route::post('pkm/create', [PkmController::class, 'store'])->name('pkm.store');
        Route::get('pkm//detail/{id}', [PkmController::class, 'show'])->name('pkm.show');
        Route::get('pkm/{id}', [PkmController::class, 'edit'])->name('pkm.edit');
        Route::put('pkm/{id}', [PkmController::class, 'update'])->name('pkm.update');
        Route::delete('pkm/{id}', [PkmController::class, 'destroy'])->name('pkm.destroy');

        Route::get('/hki', [HkiController::class, 'index'])->name('hki.index');
        Route::post('/hki', [HkiController::class, 'store'])->name('hki.store');
    });