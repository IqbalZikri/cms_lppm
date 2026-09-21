<?php

use App\Http\Controllers\Dosen\DashboardController;
use App\Http\Controllers\Dosen\HkiController;
use App\Http\Controllers\Dosen\JurnalController;
use App\Http\Controllers\Dosen\PenelitianController;
use App\Http\Controllers\Dosen\PkmController;
use Illuminate\Support\Facades\Route;

// Di routes/web.php tambahkan:  require __DIR__.'/dosen.php';
Route::middleware(['auth', 'verified'])
    ->prefix('dosen')
    ->name('dosen.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/penelitian', [PenelitianController::class, 'index'])->name('penelitian.index');
        Route::post('/penelitian', [PenelitianController::class, 'store'])->name('penelitian.store');

        Route::get('/pkm', [PkmController::class, 'index'])->name('pkm.index');
        Route::post('/pkm', [PkmController::class, 'store'])->name('pkm.store');

        Route::get('/hki', [HkiController::class, 'index'])->name('hki.index');
        Route::post('/hki', [HkiController::class, 'store'])->name('hki.store');

        Route::get('/jurnal', [JurnalController::class, 'index'])->name('jurnal.index');
        Route::post('/jurnal', [JurnalController::class, 'store'])->name('jurnal.store');
    });