<?php

namespace App\Http\Controllers;

use App\Models\SiteSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;

class SiteSettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/site_settings', [
            'site_setting' => SiteSettings::pluck('setting_value', 'setting_key'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'nama_website' => ['required', 'string', 'max:255'],
            'deskripsi_website' => ['nullable', 'string'],
            'logo_url' => ['nullable', 'image', 'max:2048'],
            'facebook_url' => ['nullable', 'url'],
            'instagram_url' => ['nullable', 'url'],
            'twitter_url' => ['nullable', 'url'],
            'telepon' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'alamat' => ['nullable', 'string'],
            'whatsapp_number' => ['nullable', 'string', 'max:20'],
            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('logo_url')) {
            $path = $request->file('logo_url')->store('site', 'public');
            $validated['logo_url'] = Storage::url($path);
        } else {
            unset($validated['logo_url']); // jangan timpa logo lama dengan null
        }

        foreach ($validated as $key => $value) {
            SiteSettings::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }

}
