<?php

namespace App\Http\Middleware;

use App\Models\SiteSettings;
use Cache;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'import_skipped' => fn() => $request->session()->get('import_skipped'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'site' => fn() => Cache::remember('site.settings', 3600, function () {
                // hasil: ['telepon' => '021-123456', 'email' => '...', ...]
                $s = SiteSettings::pluck('setting_value', 'setting_key');

                return [
                    'nama' => $s['nama_website'] ?? null,
                    'logo' => $s['logo_url'] ?? null,
                    'alamat' => $s['alamat'] ?? null,
                    'email' => $s['email'] ?? null,
                    'telepon' => $s['telepon'] ?? null,
                    'whatsapp' => $s['whatsapp_number'] ?? null,
                    'facebook' => $s['facebook_url'] ?? null,
                    'instagram' => $s['instagram_url'] ?? null,
                    'twitter' => $s['twitter_url'] ?? null,
                ];
            }),
        ];
    }
}
