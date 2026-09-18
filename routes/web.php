<?php

use App\Http\Controllers\BeritaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\FakultasController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('fakultas', [FakultasController::class, 'index'])->name('fakultas.index');
        Route::post('fakultas/store', [FakultasController::class, 'store'])->name('fakultas.store');
        Route::put('fakultas/{id}', [FakultasController::class, 'update'])->name('fakultas.update');
        Route::delete('fakultas/{id}', [FakultasController::class, 'destroy'])->name('fakultas.destroy');

        Route::get('prodi', [ProdiController::class, 'index'])->name('prodi.index');
        Route::post('prodi', [ProdiController::class, 'store'])->name('prodi.store');
        Route::put('prodi/{id}', [ProdiController::class, 'update'])->name('prodi.update');
        Route::delete('prodi/{id}', [ProdiController::class, 'destroy'])->name('prodi.destroy');

        Route::get('user', [UserController::class, 'index'])->name('user.index');
        Route::post('user', [UserController::class, 'store'])->name('user.store');
        Route::put('user/{id}', [UserController::class, 'update'])->name('user.update');
        Route::delete('user/{id}', [UserController::class, 'destroy'])->name('user.destroy');

        Route::get('dosen', [DosenController::class, 'index'])->name('dosen.index');
        Route::get('dosen/create', [DosenController::class, 'create'])->name('dosen.create');
        Route::post('dosen/create', [DosenController::class, 'store'])->name('dosen.store');
        Route::get('dosen/show/{id}', [DosenController::class, 'show'])->name('dosen.show');
        Route::get('dosen/edit/{id}', [DosenController::class, 'edit'])->name('dosen.edit');
        Route::put('dosen/edit/{id}', [DosenController::class, 'update'])->name('dosen.update');
        Route::delete('dosen/{id}', [DosenController::class, 'destroy'])->name('dosen.destroy');

        Route::get('kategori', [KategoriController::class, 'index'])->name('kategori.index');
        Route::post('kategori', [KategoriController::class, 'store'])->name('kategori.store');
        Route::put('kategori/{kategori}', [KategoriController::class, 'update'])->name('kategori.update');
        Route::delete('kategori/{kategori}', [KategoriController::class, 'destroy'])->name('kategori.destroy');

        Route::get('berita', [BeritaController::class, 'index'])->name('berita.index');
        Route::get('berita/create', [BeritaController::class, 'create'])->name('berita.create');
        Route::post('berita/create', [BeritaController::class, 'store'])->name('berita.store');
        Route::get('berita/show/{berita}', [BeritaController::class, 'show'])->name('berita.show');
        Route::get('berita/{berita}', [BeritaController::class, 'edit'])->name('berita.edit');
        Route::put('berita/ubah_status/{berita}', [BeritaController::class, 'updateStatus'])->name('berita.updateStatus');
        Route::put('berita/{berita}', [BeritaController::class, 'update'])->name('berita.update');
        Route::delete('berita/{berita}', [BeritaController::class, 'destroy'])->name('berita.destroy');

        Route::get('get-prodi/{id}', [ProdiController::class, 'getProdi'])->name('prodi.getProdi');
    });
});

require __DIR__.'/settings.php';
