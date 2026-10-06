<?php

use App\Http\Controllers\Dosen\DashboardController;
use App\Http\Controllers\Dosen\HkiController;
use App\Http\Controllers\Dosen\LuaranJurnalController;
use App\Http\Controllers\Dosen\LuaranProsidingController;
use App\Http\Controllers\Dosen\PkmController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\LuaranBukuController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:dosen'])
    ->prefix('dosen')
    ->name('dosen.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('kegiatan', [KegiatanController::class, 'indexDosen'])->name('kegiatan.index');
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

        Route::get('hki', [HkiController::class, 'index'])->name('hki.index');
        Route::get('hki/create', [HkiController::class, 'create'])->name('hki.create');
        Route::post('hki/create', [HkiController::class, 'store'])->name('hki.store');
        Route::get('hki//detail/{hki}', [HkiController::class, 'show'])->name('hki.show');
        Route::get('hki/{hki}', [HkiController::class, 'edit'])->name('hki.edit');
        Route::put('hki/{hki}', [HkiController::class, 'update'])->name('hki.update');
        Route::delete('hki/{hki}', [HkiController::class, 'destroy'])->name('hki.destroy');

        Route::get('luaran_prosiding', [LuaranProsidingController::class, 'index'])->name('luaran_prosiding.index');
        Route::get('luaran_prosiding/create', [LuaranProsidingController::class, 'create'])->name('luaran_prosiding.create');
        Route::post('luaran_prosiding/create', [LuaranProsidingController::class, 'store'])->name('luaran_prosiding.store');
        Route::get('luaran_prosiding//detail/{luaran_prosiding}', [LuaranProsidingController::class, 'show'])->name('luaran_prosiding.show');
        Route::get('luaran_prosiding/{luaran_prosiding}', [LuaranProsidingController::class, 'edit'])->name('luaran_prosiding.edit');
        Route::put('luaran_prosiding/{luaran_prosiding}', [LuaranProsidingController::class, 'update'])->name('luaran_prosiding.update');
        Route::delete('luaran_prosiding/{luaran_prosiding}', [LuaranProsidingController::class, 'destroy'])->name('luaran_prosiding.destroy');

        Route::get('luaran_jurnal', [LuaranJurnalController::class, 'index'])->name('luaran_jurnal.index');
        Route::get('luaran_jurnal/create', [LuaranJurnalController::class, 'create'])->name('luaran_jurnal.create');
        Route::post('luaran_jurnal/create', [LuaranJurnalController::class, 'store'])->name('luaran_jurnal.store');
        Route::get('luaran_jurnal//detail/{luaran_jurnal}', [LuaranJurnalController::class, 'show'])->name('luaran_jurnal.show');
        Route::get('luaran_jurnal/{luaran_jurnal}', [LuaranJurnalController::class, 'edit'])->name('luaran_jurnal.edit');
        Route::put('luaran_jurnal/{luaran_jurnal}', [LuaranJurnalController::class, 'update'])->name('luaran_jurnal.update');
        Route::delete('luaran_jurnal/{luaran_jurnal}', [LuaranJurnalController::class, 'destroy'])->name('luaran_jurnal.destroy');

        Route::get('luaran_buku', [LuaranBukuController::class, 'indexDosen'])->name('luaran_buku.index');
        Route::get('luaran_buku/create', [LuaranBukuController::class, 'create'])->name('luaran_buku.create');
        Route::post('luaran_buku/create', [LuaranBukuController::class, 'store'])->name('luaran_buku.store');
        Route::get('luaran_buku//detail/{luaran_buku}', [LuaranBukuController::class, 'show'])->name('luaran_buku.show');
        Route::get('luaran_buku/{luaran_buku}', [LuaranBukuController::class, 'edit'])->name('luaran_buku.edit');
        Route::put('luaran_buku/{luaran_buku}', [LuaranBukuController::class, 'update'])->name('luaran_buku.update');
        Route::delete('luaran_buku/{luaran_buku}', [LuaranBukuController::class, 'destroy'])->name('luaran_buku.destroy');
    });